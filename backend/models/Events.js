import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organizer: String,
    date: String,
    location: String,
    description: String,
    registrationLink: String,
    image: String,
    platform: String
}, { strict: false });

const Event = mongoose.model("Event", EventSchema);

export default Event;