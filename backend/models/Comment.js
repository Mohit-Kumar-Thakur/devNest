import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    timestamp: { type: String, default: 'Just now' },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    userVotes: [{
        userHash: String,
        voteType: String // 'up' or 'down'
    }]
}, {
    timestamps: true
});

export default mongoose.model('Comment', CommentSchema);