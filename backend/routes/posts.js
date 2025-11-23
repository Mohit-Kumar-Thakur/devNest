import express from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { generateAnonymousName } from '../utils/securityUtils.js';

// --- NEW IMPORT ---
import checkOffensive from '../middleware/checkOffensive.js'; 
// ------------------

const router = express.Router();

// Generate anonymous user hash for non-authenticated users (fallback)
const generateUserHash = (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    return crypto.createHash('md5').update(ip + userAgent).digest('hex');
};

// Get user hash from authenticated user or generate anonymous hash
const getUserHash = (req) => {
    if (req.user && req.user.id) {
        // For authenticated users, use their actual userHash
        return req.user.userHash || generateUserHash(req);
    }
    // For non-authenticated users, use IP-based hash
    return generateUserHash(req);
};

// Get all posts with filtering and sorting
router.get('/', async (req, res) => {
    try {
        const { tab = 'recent', page = 1, limit = 20 } = req.query;
        const userHash = getUserHash(req);

        let query = { isHidden: false };
        let sort = {};

        switch (tab) {
            case 'trending':
                query.trending = true;
                sort = { upvotes: -1, createdAt: -1 };
                break;
            case 'top':
                sort = { upvotes: -1, downvotes: 1 };
                break;
            default: // recent
                sort = { createdAt: -1 };
        }

        const posts = await Post.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Add user vote status to each post
        const postsWithUserVotes = posts.map(post => {
            const postObj = post.toObject();
            const userVote = post.userVotes.find(vote => vote.userHash === userHash);
            postObj.userVote = userVote ? userVote.voteType : null;

            // Add user vote status for poll
            if (post.poll && post.poll.userVotes) {
                const pollVote = post.poll.userVotes.find(vote => vote.userHash === userHash);
                postObj.poll.userVote = pollVote ? pollVote.optionId : null;
            }

            // Remove sensitive data
            delete postObj.authorHash;
            delete postObj.userId;
            delete postObj.ipAddress;
            delete postObj.userAgent;
            delete postObj.reportedBy;
            delete postObj.moderatorNotes;

            return postObj;
        });

        res.json({
            posts: postsWithUserVotes,
            currentPage: parseInt(page),
            totalPages: Math.ceil(await Post.countDocuments(query) / limit),
            totalPosts: await Post.countDocuments(query)
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new post (protected route)
// --- UPDATED ROUTE: Added 'checkOffensive' middleware here ---
router.post('/', protect, checkOffensive, async (req, res) => {
    try {
        const userId = req.user.id;
        const userHash = req.user.userHash;
        
        const {
            content,
            isAnonymous = true,
            images = [],
            videos = [],
            pdfs = [],
            poll,
            isRepost = false,
            originalPostId,
            repostThoughts
        } = req.body;

        console.log('Creating post for user:', userId, 'Hash:', userHash);

        // Get user to ensure they're not banned
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isBanned) {
            return res.status(403).json({ error: 'Account is banned. Cannot create posts.' });
        }

        // Generate author name
        const authorName = isAnonymous ? generateAnonymousName(userHash) : user.name;

        const postData = {
            content,
            author: authorName,
            authorHash: userHash, // Use the authenticated user's hash
            userId: userId, // Reference to actual user
            images,
            videos,
            pdfs,
            tags: (content.match(/#(\w+)/g) || []).map(tag => tag.slice(1)),
            isRepost,
            repostThoughts,
            // Security info
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        if (isRepost && originalPostId) {
            postData.originalPostId = originalPostId;
            // Increment repost count of original post
            await Post.findByIdAndUpdate(originalPostId, { $inc: { reposts: 1 } });
        }

        if (poll) {
            postData.poll = {
                ...poll,
                options: poll.options.map(opt => ({
                    id: uuidv4(),
                    text: opt.text,
                    votes: 0
                })),
                totalVotes: 0,
                userVotes: [],
                endsAt: poll.endsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days
            };
        }

        const post = new Post(postData);
        await post.save();

        // Format response without sensitive data
        const responsePost = {
            ...post.toObject(),
            id: post._id,
            // Remove sensitive data
            authorHash: undefined,
            userId: undefined,
            ipAddress: undefined,
            userAgent: undefined,
            reportedBy: undefined,
            moderatorNotes: undefined
        };

        res.status(201).json(responsePost);
    } catch (error) {
        console.error('Error creating post:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Validation error',
                details: errors 
            });
        }
        
        res.status(400).json({ error: error.message });
    }
});

// Vote on post (protected route)
router.post('/:id/vote', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body; // 'up' or 'down'
        const userHash = req.user.userHash;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Remove existing vote
        const existingVoteIndex = post.userVotes.findIndex(vote => vote.userHash === userHash);

        if (existingVoteIndex > -1) {
            const existingVote = post.userVotes[existingVoteIndex];
            if (existingVote.voteType === 'up') post.upvotes--;
            if (existingVote.voteType === 'down') post.downvotes--;

            post.userVotes.splice(existingVoteIndex, 1);
        }

        // Add new vote if different from current
        if (existingVoteIndex === -1 || post.userVotes[existingVoteIndex]?.voteType !== voteType) {
            post.userVotes.push({ 
                userHash, 
                voteType,
                votedAt: new Date()
            });
            if (voteType === 'up') post.upvotes++;
            if (voteType === 'down') post.downvotes++;
        }

        // Update trending status
        post.trending = post.upvotes > 20;

        await post.save();

        res.json({
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            userVote: voteType
        });
    } catch (error) {
        console.error('Error voting on post:', error);
        res.status(400).json({ error: error.message });
    }
});

// Vote on poll (protected route)
router.post('/:id/poll/vote', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { optionId } = req.body;
        const userHash = req.user.userHash;

        const post = await Post.findById(id);
        if (!post || !post.poll) {
            return res.status(404).json({ error: 'Post or poll not found' });
        }

        // Remove existing vote
        const existingVoteIndex = post.poll.userVotes.findIndex(vote => vote.userHash === userHash);

        if (existingVoteIndex > -1) {
            const existingVote = post.poll.userVotes[existingVoteIndex];
            const option = post.poll.options.find(opt => opt.id === existingVote.optionId);
            if (option) {
                option.votes--;
                post.poll.totalVotes--;
            }
            post.poll.userVotes.splice(existingVoteIndex, 1);
        }

        // Add new vote
        const option = post.poll.options.find(opt => opt.id === optionId);
        if (option) {
            option.votes++;
            post.poll.totalVotes++;
            post.poll.userVotes.push({ 
                userHash, 
                optionId,
                votedAt: new Date()
            });
        }

        await post.save();

        res.json(post.poll);
    } catch (error) {
        console.error('Error voting on poll:', error);
        res.status(400).json({ error: error.message });
    }
});

// Report post (protected route)
router.post('/:id/report', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const userHash = req.user.userHash;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user already reported
        const alreadyReported = post.reportedBy.some(report => report.userHash === userHash);

        if (!alreadyReported) {
            post.reportedBy.push({
                userHash: userHash,
                reportedAt: new Date()
            });
            
            // Mark as reported if 3+ users report
            post.reported = post.reportedBy.length >= 3;
            
            // If auto-flagged, increment author's reported count
            if (post.reported) {
                await User.findOneAndUpdate(
                    { userHash: post.authorHash },
                    { $inc: { reportedCount: 1 } }
                );
            }
        }

        await post.save();

        res.json({ 
            reported: post.reported, 
            reportCount: post.reportedBy.length,
            message: post.reported 
                ? 'Post has been flagged for review due to multiple reports'
                : 'Thank you for your report'
        });
    } catch (error) {
        console.error('Error reporting post:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userHash = getUserHash(req);

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // If it's a repost and has originalPostId, fetch the original post
        let originalPost = null;
        if (post.isRepost && post.originalPostId) {
            originalPost = await Post.findById(post.originalPostId);
        }

        const postObj = post.toObject();
        const userVote = post.userVotes.find(vote => vote.userHash === userHash);
        postObj.userVote = userVote ? userVote.voteType : null;

        // Add original post data if available
        if (originalPost) {
            postObj.originalPost = {
                id: originalPost._id,
                content: originalPost.content,
                author: originalPost.author,
                timestamp: originalPost.timestamp,
                images: originalPost.images,
                videos: originalPost.videos,
                pdfs: originalPost.pdfs
            };
        }

        // Remove sensitive data
        delete postObj.authorHash;
        delete postObj.userId;
        delete postObj.ipAddress;
        delete postObj.userAgent;
        delete postObj.reportedBy;
        delete postObj.moderatorNotes;

        res.json(postObj);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete post (admin functionality - protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is admin
        if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(400).json({ error: error.message });
    }
});

export default router;