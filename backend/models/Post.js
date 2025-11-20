import mongoose from 'mongoose';

const PollOptionSchema = new mongoose.Schema({
    id: String,
    text: String,
    votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
    question: String,
    options: [PollOptionSchema],
    totalVotes: { type: Number, default: 0 },
    endsAt: Date,
    userVotes: [{
        userHash: String,
        optionId: String
    }]
});

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    timestamp: { type: String, default: 'Just now' },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    reposts: { type: Number, default: 0 },
    isRepost: { type: Boolean, default: false },
    originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    repostThoughts: String,
    tags: [String],
    reported: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    images: [String],
    videos: [String],
    pdfs: [{
        name: String,
        url: String
    }],
    poll: PollSchema,
    userVotes: [{
        userHash: String,
        voteType: String // 'up' or 'down'
    }],
    reportedBy: [String] // Array of user hashes who reported
}, {
    timestamps: true
});

// Index for better query performance
PostSchema.index({ createdAt: -1 });
PostSchema.index({ upvotes: -1 });
PostSchema.index({ trending: -1 });

export default mongoose.model('Post', PostSchema);