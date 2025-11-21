import User from "../models/User.js";
import Post from "../models/Post.js";
import { generateUserHash, verifyUserHash } from "./securityUtils.js";

/**
 * Admin tool to find user by post hash
 */
export const identifyUserFromPost = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Find user by hash
    const user = await User.findOne({ userHash: post.authorHash });
    if (!user) {
      throw new Error('User not found for this hash');
    }

    // Verify the hash matches (security check)
    const isValidHash = verifyUserHash(post.authorHash, user._id.toString(), user.email);
    if (!isValidHash) {
      throw new Error('Hash verification failed - possible tampering');
    }

    return {
      post: {
        id: post._id,
        content: post.content,
        createdAt: post.createdAt
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        reportedCount: user.reportedCount,
        isBanned: user.isBanned,
        createdAt: user.createdAt
      },
      security: {
        hashVerified: true,
        hash: post.authorHash
      }
    };
  } catch (error) {
    console.error('Identification error:', error);
    throw error;
  }
};

/**
 * Get all posts by a specific user (admin only)
 */
export const getUserPosts = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const posts = await Post.find({ authorHash: user.userHash })
    .sort({ createdAt: -1 })
    .select('content createdAt upvotes downvotes reported reportedBy');

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      userHash: user.userHash
    },
    posts: posts,
    stats: {
      totalPosts: posts.length,
      totalUpvotes: posts.reduce((sum, post) => sum + post.upvotes, 0),
      reportedPosts: posts.filter(post => post.reported).length
    }
  };
};