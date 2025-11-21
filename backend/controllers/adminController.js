import Post from "../models/Post.js";
import User from "../models/User.js";
import { logSecurityEvent } from "../utils/securityUtils.js";

// Get all flagged posts for review
export const getFlaggedPosts = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ 
            $or: [{ reported: true }, { isHidden: true }] 
        })
        .sort({ 'reportedBy.length': -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const postsWithAuthors = await Promise.all(
            posts.map(async (post) => {
                const author = await User.findOne({ userHash: post.authorHash });
                return {
                    ...post.toObject(),
                    id: post._id,
                    authorInfo: author ? {
                        id: author._id,
                        name: author.name,
                        email: author.email,
                        reportedCount: author.reportedCount,
                        isBanned: author.isBanned
                    } : null
                };
            })
        );

        res.json({
            posts: postsWithAuthors,
            total: await Post.countDocuments({ $or: [{ reported: true }, { isHidden: true }] }),
            page: parseInt(page),
            totalPages: Math.ceil(await Post.countDocuments({ $or: [{ reported: true }, { isHidden: true }] }) / limit)
        });
    } catch (error) {
        console.error("Get flagged posts error:", error);
        res.status(500).json({ message: "Server error fetching flagged posts" });
    }
};

// Identify post author (admin only)
export const identifyPostAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the actual user
        const author = await User.findOne({ userHash: post.authorHash });
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        // Log the identification
        logSecurityEvent('AUTHOR_IDENTIFIED', req.user.id, id, {
            authorId: author._id,
            authorEmail: author.email,
            authorName: author.name
        });

        res.json({
            postId: post._id,
            postContent: post.content,
            postCreatedAt: post.createdAt,
            author: {
                id: author._id,
                name: author.name,
                email: author.email,
                role: author.role,
                reportedCount: author.reportedCount,
                isBanned: author.isBanned,
                createdAt: author.createdAt
            },
            security: {
                authorHash: post.authorHash,
                totalReports: post.reportedBy.length,
                reportedByUsers: post.reportedBy.length
            }
        });
    } catch (error) {
        console.error("Identify author error:", error);
        res.status(500).json({ message: "Server error identifying author" });
    }
};

// Ban user based on abusive behavior
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, duration } = req.body; // duration in days

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent banning admins
        if (user.role === 'admin') {
            return res.status(403).json({ message: "Cannot ban administrators" });
        }

        const banExpires = duration ? 
            new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

        user.isBanned = true;
        user.banReason = reason;
        user.banExpires = banExpires;

        await user.save();

        // Hide all user's posts
        await Post.updateMany(
            { authorHash: user.userHash },
            { isHidden: true }
        );

        // Log the ban action
        logSecurityEvent('USER_BANNED', req.user.id, null, {
            bannedUserId: user._id,
            bannedUserEmail: user.email,
            reason: reason,
            duration: duration,
            banExpires: banExpires
        });

        res.json({
            message: `User ${user.name} has been banned${banExpires ? ' temporarily' : ' permanently'}`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isBanned: user.isBanned,
                banReason: user.banReason,
                banExpires: user.banExpires
            }
        });
    } catch (error) {
        console.error("Ban user error:", error);
        res.status(500).json({ message: "Server error banning user" });
    }
};

// Unban user
export const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBanned = false;
        user.banReason = null;
        user.banExpires = null;

        await user.save();

        // Unhide user's posts
        await Post.updateMany(
            { authorHash: user.userHash },
            { isHidden: false }
        );

        logSecurityEvent('USER_UNBANNED', req.user.id, null, {
            unbannedUserId: user._id,
            unbannedUserEmail: user.email
        });

        res.json({
            message: `User ${user.name} has been unbanned`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isBanned: user.isBanned
            }
        });
    } catch (error) {
        console.error("Unban user error:", error);
        res.status(500).json({ message: "Server error unbanning user" });
    }
};

// Get post analytics for admin dashboard
export const getPostAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // Total posts count
        const totalPosts = await Post.countDocuments();
        const recentPosts = await Post.countDocuments({ 
            createdAt: { $gte: startDate } 
        });

        // Flagged posts count
        const flaggedPosts = await Post.countDocuments({ reported: true });
        const hiddenPosts = await Post.countDocuments({ isHidden: true });

        // Posts by day (for chart)
        const postsByDay = await Post.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 },
                    reported: {
                        $sum: { $cond: [{ $eq: ["$reported", true] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Top reporters
        const topReporters = await Post.aggregate([
            { $unwind: "$reportedBy" },
            {
                $group: {
                    _id: "$reportedBy.userHash",
                    reportCount: { $sum: 1 }
                }
            },
            { $sort: { reportCount: -1 } },
            { $limit: 10 }
        ]);

        // Most reported users
        const mostReportedUsers = await Post.aggregate([
            {
                $match: { reported: true }
            },
            {
                $group: {
                    _id: "$authorHash",
                    postCount: { $sum: 1 },
                    totalReports: { $sum: { $size: "$reportedBy" } }
                }
            },
            { $sort: { totalReports: -1 } },
            { $limit: 10 }
        ]);

        // Populate most reported users with actual user info
        const mostReportedUsersWithInfo = await Promise.all(
            mostReportedUsers.map(async (user) => {
                const userInfo = await User.findOne({ userHash: user._id });
                return {
                    authorHash: user._id,
                    postCount: user.postCount,
                    totalReports: user.totalReports,
                    userInfo: userInfo ? {
                        id: userInfo._id,
                        name: userInfo.name,
                        email: userInfo.email,
                        isBanned: userInfo.isBanned
                    } : null
                };
            })
        );

        res.json({
            overview: {
                totalPosts,
                recentPosts,
                flaggedPosts,
                hiddenPosts,
                reportingRate: totalPosts > 0 ? (flaggedPosts / totalPosts * 100).toFixed(2) : 0
            },
            charts: {
                postsByDay,
                topReporters,
                mostReportedUsers: mostReportedUsersWithInfo
            },
            timeRange: {
                days: parseInt(days),
                startDate,
                endDate: new Date()
            }
        });
    } catch (error) {
        console.error("Get post analytics error:", error);
        res.status(500).json({ message: "Server error fetching analytics" });
    }
};

// Get user analytics
export const getUserAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // User statistics
        const totalUsers = await User.countDocuments();
        const recentUsers = await User.countDocuments({ 
            createdAt: { $gte: startDate } 
        });
        const bannedUsers = await User.countDocuments({ isBanned: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const moderatorUsers = await User.countDocuments({ role: 'moderator' });

        // Users with most reports
        const usersWithReports = await User.find({ reportedCount: { $gt: 0 } })
            .sort({ reportedCount: -1 })
            .limit(10)
            .select('name email reportedCount isBanned createdAt');

        // User registration by day
        const usersByDay = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            overview: {
                totalUsers,
                recentUsers,
                bannedUsers,
                adminUsers,
                moderatorUsers,
                activeUsers: totalUsers - bannedUsers
            },
            usersWithReports,
            charts: {
                usersByDay
            }
        });
    } catch (error) {
        console.error("Get user analytics error:", error);
        res.status(500).json({ message: "Server error fetching user analytics" });
    }
};

// Get all users with pagination and filtering
export const getUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search = '',
            role = '',
            banned = '' 
        } = req.query;

        const skip = (page - 1) * limit;
        
        // Build filter
        let filter = {};
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role) {
            filter.role = role;
        }
        
        if (banned !== '') {
            filter.isBanned = banned === 'true';
        }

        const users = await User.find(filter)
            .select('-password -verifyToken -resetOTP -resetOTPExpires')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            users,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};