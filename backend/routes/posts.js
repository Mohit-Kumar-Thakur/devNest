import express from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Post from '../models/Post.js';

const router = express.Router();

// Generate anonymous user hash
const generateUserHash = (req) => {
    // Use IP + user agent to generate consistent hash for anonymous user
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    return crypto.createHash('md5').update(ip + userAgent).digest('hex');
};

// Get all posts with filtering and sorting
router.get('/', async(req, res) => {
    try {
        const { tab = 'recent', page = 1, limit = 20 } = req.query;
        const userHash = generateUserHash(req);

        let query = {};
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
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('originalPost');

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

// Create new post
router.post('/', async(req, res) => {
    try {
        const userHash = generateUserHash(req);
        const {
            content,
            author,
            isAnonymous = true,
            images = [],
            videos = [],
            pdfs = [],
            poll,
            isRepost = false,
            originalPostId,
            repostThoughts
        } = req.body;

        const anonymousNames = [
            'Anonymous Owl', 'Night Owl', 'Code Warrior', 'Study Buddy', 'Tech Ninja',
            'Silent Scholar', 'Mystery Student', 'Campus Ghost', 'Digital Nomad', 'Wisdom Seeker'
        ];

        const postData = {
            content,
            author: isAnonymous ? anonymousNames[Math.floor(Math.random() * anonymousNames.length)] : author,
            images,
            videos,
            pdfs,
            tags: (content.match(/#(\w+)/g) || []).map(tag => tag.slice(1)),
            isRepost,
            repostThoughts
        };

        if (isRepost && originalPostId) {
            postData.originalPost = originalPostId;
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
                userVotes: []
            };
        }

        const post = new Post(postData);
        await post.save();

        // Populate the original post if it's a repost
        if (isRepost && originalPostId) {
            await post.populate('originalPost');
        }

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({ error: error.message });
    }
});

// Vote on post
router.post('/:id/vote', async(req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body; // 'up' or 'down'
        const userHash = generateUserHash(req);

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
        if (existingVoteIndex === -1 || post.userVotes[existingVoteIndex] ?.voteType !== voteType) {
            post.userVotes.push({ userHash, voteType });
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

// Vote on poll
router.post('/:id/poll/vote', async(req, res) => {
    try {
        const { id } = req.params;
        const { optionId } = req.body;
        const userHash = generateUserHash(req);

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
            post.poll.userVotes.push({ userHash, optionId });
        }

        await post.save();

        res.json(post.poll);
    } catch (error) {
        console.error('Error voting on poll:', error);
        res.status(400).json({ error: error.message });
    }
});

// Report post
router.post('/:id/report', async(req, res) => {
    try {
        const { id } = req.params;
        const userHash = generateUserHash(req);

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.reportedBy.includes(userHash)) {
            post.reportedBy.push(userHash);
            post.reported = post.reportedBy.length >= 3; // Mark as reported if 3+ users report
        }

        await post.save();

        res.json({ reported: post.reported, reportCount: post.reportedBy.length });
    } catch (error) {
        console.error('Error reporting post:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get single post
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const userHash = generateUserHash(req);

        const post = await Post.findById(id).populate('originalPost');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postObj = post.toObject();
        const userVote = post.userVotes.find(vote => vote.userHash === userHash);
        postObj.userVote = userVote ? userVote.voteType : null;

        res.json(postObj);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete post (admin functionality)
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;

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