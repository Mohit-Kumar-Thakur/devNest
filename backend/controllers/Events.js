import Event from "../models/Events.js";

// GET ALL EVENTS (merged internal + external)
export const getAllEvents = async(req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

// ADD INTERNAL EVENT
export const addEvent = async(req, res) => {
    try {
        const saved = await Event.create(req.body);
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: "Failed to add event" });
    }
};

// UPDATE EVENT
export const updateEvent = async(req, res) => {
    try {
        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update event" });
    }
};

// DELETE EVENT
export const deleteEvent = async(req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete event" });
    }
};