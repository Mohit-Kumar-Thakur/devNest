import express from "express";
import Event from "../models/Events.js";
import ExternalEvent from "../models/ExternalEvent.js"; // if you use it

const router = express.Router();

router.get("/all", async(req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

export default router;