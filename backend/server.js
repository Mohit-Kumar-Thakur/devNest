import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import connectDB from "./config/db.js";

import eventRoutes from "./routes/EventRoutes.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import groqRoute from "./routes/groq.js";

import fetchAllEvents from "./cron/fetchEvents.js";

dotenv.config();
const app = express();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// CORS (Render Ready)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Helmet AFTER CORS
app.use(helmet());

// Body parsing
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate Limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/groq", groqRoute);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// CONNECT DB FIRST
connectDB().then(() => {
  console.log("⚡ DB connected, running scrapers...");

  // Run scrapers once after DB is ready
  fetchAllEvents();

  // Run scraper every 12 hours
  cron.schedule("0 */12 * * *", fetchAllEvents);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
