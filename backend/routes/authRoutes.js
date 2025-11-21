import express from "express";
import { 
    registerUser, 
    registerAdmin, 
    verifyEmail, 
    loginUser, 
    googleLogin, 
    sendOTP, 
    resetPassword, 
    getProfile,
    getUsers,
    deleteUser
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/role.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/register-admin", registerAdmin); // Admin registration
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/send-otp", sendOTP);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", protect, getProfile);

// Admin only routes
router.get("/users", protect, authorizeRole("admin"), getUsers);
router.delete("/users/:id", protect, authorizeRole("admin"), deleteUser);
router.get("/admin-check", protect, authorizeRole("admin"), (req, res) => res.json({ ok: true }));

export default router;