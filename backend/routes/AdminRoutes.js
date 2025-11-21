import express from "express";
import { protect } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/role.js";
import { 
    identifyPostAuthor, 
    getFlaggedPosts, 
    banUser,
    getPostAnalytics 
} from "../controllers/adminController.js";

const router = express.Router();

// Admin only routes
router.get("/posts/flagged", protect, authorizeRole(["admin", "moderator"]), getFlaggedPosts);
router.get("/posts/:id/identify", protect, authorizeRole(["admin", "moderator"]), identifyPostAuthor);
router.post("/users/:id/ban", protect, authorizeRole(["admin"]), banUser);
router.get("/analytics/posts", protect, authorizeRole(["admin", "moderator"]), getPostAnalytics);

export default router;