// controllers/AdminRegister.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createAdminUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin user
        const adminUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        await adminUser.save();

        res.status(201).json({
            message: "Admin user created successfully",
            user: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (error) {
        console.error("Create admin error:", error);
        res.status(500).json({ message: "Server error creating admin user" });
    }
};