import express from 'express';
import crypto from 'crypto';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const router = express.Router();

const generateUserHash = (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    return crypto.createHash('md5').update(ip + userAgent).digest('hex');
};

// Get comments for a post
router.get('/post/:postId', async(req, res) => {
    try {
        const { postId } = req.params;
        const userHash = generateUserHash(req);

        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

        const commentsWithUserVotes = comments.map(comment => {
            const commentObj = comment.toObject();
            const userVote = comment.userVotes.find(vote => vote.userHash === userHash);
            commentObj.userVote = userVote ? userVote.voteType : null;
            return commentObj;
        });

        res.json(commentsWithUserVotes);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create comment
router.post('/', async(req, res) => {
    try {
        const userHash = generateUserHash(req);
        const { postId, content, isAnonymous = true } = req.body;

        const anonymousNames = [
            'Anonymous Owl', 'Night Owl', 'Code Warrior', 'Study Buddy', 'Tech Ninja'
        ];

        const comment = new Comment({
            postId,
            content,
            author: isAnonymous ? anonymousNames[Math.floor(Math.random() * anonymousNames.length)] : 'You'
        });

        await comment.save();

        // Update post comments count
        await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(400).json({ error: error.message });
    }
});

// Vote on comment
router.post('/:id/vote', async(req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body;
        const userHash = generateUserHash(req);

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const existingVoteIndex = comment.userVotes.findIndex(vote => vote.userHash === userHash);

        if (existingVoteIndex > -1) {
            const existingVote = comment.userVotes[existingVoteIndex];
            if (existingVote.voteType === 'up') comment.upvotes--;
            if (existingVote.voteType === 'down') comment.downvotes--;

            comment.userVotes.splice(existingVoteIndex, 1);
        }

        if (existingVoteIndex === -1 || comment.userVotes[existingVoteIndex] ?.voteType !== voteType) {
            comment.userVotes.push({ userHash, voteType });
            if (voteType === 'up') comment.upvotes++;
            if (voteType === 'down') comment.downvotes++;
        }

        await comment.save();

        res.json({
            upvotes: comment.upvotes,
            downvotes: comment.downvotes,
            userVote: voteType
        });
    } catch (error) {
        console.error('Error voting on comment:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete comment
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Decrement post comments count
        await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(400).json({ error: error.message });
    }
});

export default router;