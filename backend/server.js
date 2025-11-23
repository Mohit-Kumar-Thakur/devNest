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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/groq", groqRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// CONNECT DB → THEN RUN SCRAPERS
connectDB().then(() => {
  console.log("⚡ Database connected");

  fetchAllEvents(); // RUN ONCE

  cron.schedule("0 */12 * * *", fetchAllEvents); // RUN EVERY 12 HRS
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
