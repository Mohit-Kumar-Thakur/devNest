import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import connectDB from "./config/db.js";

// Routes
import eventRoutes from "./routes/EventRoutes.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";

// Chatbot
import groqRoute from "./routes/groq.js";

// Cron Job
import fetchAllEvents from "./cron/fetchEvents.js";

dotenv.config();
const app = express();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
// Security + Basic Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Connect to DB
connectDB();

// API Routes
app.use("/api/events", eventRoutes);
// app.use("/api/chatbot", chatbotRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// Health Check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Run scraper once
fetchAllEvents();

// Cron Job (Every 12 hours)
cron.schedule("0 */12 * * *", fetchAllEvents);

// Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.use("/api/groq", groqRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;