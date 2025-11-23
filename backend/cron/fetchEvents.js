import scrapeUnstop from "../scrapers/unstop.js";
import scrapeDevpost from "../scrapers/devpost.js";

import Event from "../models/Events.js";

const techKeywords = [
    "hackathon", "innovation", "coding", "developer", "engineering",
    "tech", "web", "ai", "ml", "data", "robotics", "iot",
    "cyber", "blockchain", "software", "app", "cloud",
    "security", "startup", "full stack", "frontend", "backend",
    "machine learning", "deep learning"
];

function isTechEvent(event) {
    const text = `${event.title} ${event.description}`.toLowerCase();
    return techKeywords.some(k => text.includes(k));
}

const fetchAllEvents = async () => {
    console.log("🔄 Running scrapers...");

    let unstop = [];
    let devpost = [];
    let github = [];

    try { unstop = await scrapeUnstop(); } catch(e) { console.log("Unstop error:", e.message); }
    try { devpost = await scrapeDevpost(); } catch(e) { console.log("Devpost error:", e.message); }

    // ❌ NEVER RUN GITHUB SCRAPER IN PRODUCTION
    if (process.env.NODE_ENV !== "production") {
        try {
            const scraper = (await import("../scrapers/githubEvents.js")).default;
            github = await scraper();
        } catch (e) {
            console.log("GitHub scraper disabled:", e.message);
        }
    } else {
        console.log("GitHub scraper skipped in production.");
    }

    let allEvents = [...unstop, ...devpost, ...github];

    allEvents = allEvents.filter(isTechEvent);
    allEvents = allEvents.filter(ev => ev.registrationLink);

    for (const ev of allEvents) {
        try {
            await Event.updateOne(
                { title: ev.title, platform: ev.platform },
                { $set: ev },
                { upsert: true }
            );
        } catch (e) {
            console.log("DB error:", e.message);
        }
    }

    console.log("✅ Events updated!");
};

export default fetchAllEvents;
