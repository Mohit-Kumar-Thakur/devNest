import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/role.js";
import { 
    identifyPostAuthor, 
    getFlaggedPosts, 
    banUser,
    getPostAnalytics,
    unbanUser,
    getUserAnalytics,
    getUsers,
    getAnonymousPosts
} from "../controllers/adminController.js";

const router = express.Router();

// Admin only routes
router.get("/flagged-posts", protect, authorizeRole("admin", "moderator"), getFlaggedPosts);
router.get("/identify-author/:id", protect, authorizeRole("admin", "moderator"), identifyPostAuthor);
router.post("/ban-user/:id", protect, authorizeRole("admin"), banUser);
router.post("/unban-user/:id", protect, authorizeRole("admin"), unbanUser);
router.get("/analytics", protect, authorizeRole("admin", "moderator"), getPostAnalytics);
router.get("/analytics/users", protect, authorizeRole("admin", "moderator"), getUserAnalytics);
router.get("/users", protect, authorizeRole("admin", "moderator"), getUsers);
router.get("/anonymous-posts", protect, authorizeRole("admin", "moderator"), getAnonymousPosts);


export default router;