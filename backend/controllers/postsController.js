import Post from "../models/Post.js";
import User from "../models/User.js";
import { generateAnonymousName, logSecurityEvent } from "../utils/securityUtils.js";

// Create post with security tracking
export const createPost = async (req, res) => {
    try {
        const { content, isAnonymous = true, images, videos, pdfs, poll } = req.body;
        const userId = req.user.id; // From auth middleware

        console.log('Creating post for user:', userId);
        console.log('Post data:', { content, isAnonymous, hasImages: !!images, hasVideos: !!videos, hasPdfs: !!pdfs, hasPoll: !!poll });

        // Get user details with proper error handling
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found:', userId);
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: "Account is banned. Cannot create posts." });
        }

        // Check if userHash exists, generate if not
        if (!user.userHash) {
            console.log('Generating userHash for user:', user.email);
            // This should trigger the pre-save middleware, but let's ensure it exists
            await user.save(); // This will trigger the pre-save middleware to generate userHash
            // Refresh user to get the generated hash
            const updatedUser = await User.findById(userId);
            user.userHash = updatedUser.userHash;
        }

        console.log('User hash:', user.userHash);

        if (!user.userHash) {
            console.error('User hash generation failed for user:', user.email);
            return res.status(500).json({ message: "User security configuration error" });
        }

        // Use user's hash for tracking
        const authorHash = user.userHash;
        const authorName = isAnonymous ? generateAnonymousName(authorHash) : user.name;

        console.log('Post author:', authorName, 'Hash:', authorHash);

        const postData = {
            content,
            author: authorName,
            authorHash: authorHash, // This is now guaranteed to exist
            userId: user._id,
            images: images || [],
            videos: videos || [],
            pdfs: pdfs || [],
            poll: poll ? {
                ...poll,
                userVotes: []
            } : undefined,
            // Security info
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        console.log('Creating post with data:', postData);

        const post = await Post.create(postData);
        console.log('Post created successfully:', post._id);

        // Log creation for security
        logSecurityEvent('POST_CREATED', userId, post._id, {
            anonymous: isAnonymous,
            hasMedia: !!(images?.length || videos?.length || pdfs?.length),
            hasPoll: !!poll
        });

        // Format the response
        const formattedPost = await formatPostForResponse(post, userId);

        res.status(201).json({
            message: "Post created successfully",
            post: formattedPost
        });
    } catch (error) {
        console.error("Create post error:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation error",
                errors 
            });
        }
        
        res.status(500).json({ message: "Server error creating post" });
    }
};

// Get posts with security filtering
export const getPosts = async (req, res) => {
    try {
        const { tab = 'recent', page = 1 } = req.query;
        const userId = req.user?.id;
        const limit = 20;
        const skip = (page - 1) * limit;

        let query = { isHidden: false };
        
        // Apply tab filters
        if (tab === 'trending') {
            query.trending = true;
        } else if (tab === 'top') {
            query.upvotes = { $gte: 5 };
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format posts without using populate for originalPost
        const formattedPosts = await Promise.all(
            posts.map(async (post) => {
                let originalPost = null;
                
                // If it's a repost, fetch the original post manually
                if (post.isRepost && post.originalPostId) {
                    originalPost = await Post.findById(post.originalPostId);
                }
                
                return await formatPostForResponse(post, userId, originalPost);
            })
        );

        res.json({
            posts: formattedPosts,
            hasMore: posts.length === limit
        });
    } catch (error) {
        console.error("Get posts error:", error);
        res.status(500).json({ message: "Server error fetching posts" });
    }
};

// Enhanced helper function to format post for response
const formatPostForResponse = async (post, userId, originalPost = null) => {
    const user = userId ? await User.findById(userId) : null;
    const userHash = user?.userHash;

    const response = {
        ...post.toObject(),
        id: post._id,
        userVote: userHash ? post.userVotes?.find(vote => vote.userHash === userHash)?.voteType : null,
        reported: userHash ? post.reportedBy?.some(report => report.userHash === userHash) : false,
    };

    // Add original post data if this is a repost
    if (post.isRepost && originalPost) {
        response.originalPost = await formatPostForResponse(originalPost, userId);
    } else if (post.isRepost && post.originalPostId) {
        // If originalPost wasn't provided, fetch it
        const fetchedOriginalPost = await Post.findById(post.originalPostId);
        if (fetchedOriginalPost) {
            response.originalPost = await formatPostForResponse(fetchedOriginalPost, userId);
        }
    }

    // Remove sensitive data from response
    const sensitiveFields = ['authorHash', 'userId', 'ipAddress', 'userAgent', 'reportedBy', 'moderatorNotes', '__v', 'userVotes'];
    sensitiveFields.forEach(field => {
        delete response[field];
    });

    return response;
};

// Vote on post
export const votePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user || !user.userHash) {
            return res.status(404).json({ message: "User not found or invalid" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userHash = user.userHash;
        const existingVote = post.userVotes.find(vote => vote.userHash === userHash);

        let userVote = null;

        if (existingVote) {
            // User already voted - toggle or change vote
            if (existingVote.voteType === voteType) {
                // Remove vote if clicking same button
                post.userVotes = post.userVotes.filter(vote => vote.userHash !== userHash);
                if (voteType === 'up') post.upvotes -= 1;
                if (voteType === 'down') post.downvotes -= 1;
            } else {
                // Change vote
                existingVote.voteType = voteType;
                // Adjust counts
                if (voteType === 'up') {
                    post.upvotes += 1;
                    post.downvotes -= 1;
                } else {
                    post.downvotes += 1;
                    post.upvotes -= 1;
                }
                userVote = voteType;
            }
        } else {
            // New vote
            post.userVotes.push({
                userHash,
                voteType,
                votedAt: new Date()
            });
            if (voteType === 'up') post.upvotes += 1;
            if (voteType === 'down') post.downvotes += 1;
            userVote = voteType;
        }

        await post.save();

        res.json({
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            userVote
        });
    } catch (error) {
        console.error("Vote post error:", error);
        res.status(500).json({ message: "Server error voting on post" });
    }
};

// Report post
export const reportPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user || !user.userHash) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userHash = user.userHash;

        // Check if user already reported
        const alreadyReported = post.reportedBy.some(report => 
            report.userHash === userHash
        );

        if (alreadyReported) {
            return res.status(400).json({ message: "You have already reported this post" });
        }

        // Add report
        post.reportedBy.push({
            userHash: userHash,
            reportedAt: new Date()
        });

        // Auto-flag if multiple reports
        const reportThreshold = 3;
        if (post.reportedBy.length >= reportThreshold) {
            post.reported = true;
            
            // Increment reported count for the author
            await User.findOneAndUpdate(
                { userHash: post.authorHash },
                { $inc: { reportedCount: 1 } }
            );

            // Log security event
            logSecurityEvent('POST_AUTO_FLAGGED', userId, id, {
                reportCount: post.reportedBy.length,
                authorHash: post.authorHash
            });
        }

        await post.save();

        res.json({
            reported: post.reported,
            reportCount: post.reportedBy.length,
            message: post.reported 
                ? "Post has been flagged for review due to multiple reports" 
                : "Thank you for your report"
        });
    } catch (error) {
        console.error("Report post error:", error);
        res.status(500).json({ message: "Server error reporting post" });
    }
};