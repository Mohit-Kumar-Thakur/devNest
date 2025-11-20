import express from "express";
import {
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent
} from "../controllers/Events.js";

const router = express.Router();

router.get("/all", getAllEvents);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;