import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: String,
  author: String, // Display name (Anonymous User, Silent Scholar, etc.)
  authorHash: { type: String, required: true }, // Links to actual user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to actual user
  timestamp: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  reposts: { type: Number, default: 0 },
  isRepost: { type: Boolean, default: false },
  originalPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Reference to original post
  repostThoughts: String,
  tags: [String],
  reported: { type: Boolean, default: false },
  reportedBy: [{
    userHash: String,
    reportedAt: { type: Date, default: Date.now }
  }],
  trending: { type: Boolean, default: false },
  images: [String],
  videos: [String],
  pdfs: [{
    name: String,
    url: String
  }],
  poll: {
    question: String,
    options: [{
      id: String,
      text: String,
      votes: { type: Number, default: 0 }
    }],
    totalVotes: { type: Number, default: 0 },
    endsAt: Date,
    userVotes: [{
      userHash: String,
      optionId: String,
      votedAt: { type: Date, default: Date.now }
    }]
  },
  userVotes: [{
    userHash: String,
    voteType: { type: String, enum: ['up', 'down'] },
    votedAt: { type: Date, default: Date.now }
  }],
  // Security fields
  ipAddress: String, // For extreme cases
  userAgent: String,
  isHidden: { type: Boolean, default: false }, // Hide from public if needed
  moderatorNotes: String // Admin notes about the post
}, { 
  timestamps: true,
  // Add this to fix the strict populate error
  strictPopulate: false 
});

export default mongoose.model("Post", postSchema);