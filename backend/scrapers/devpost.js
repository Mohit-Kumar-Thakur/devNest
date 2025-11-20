import axios from "axios";

const scrapeDevpost = async() => {
    try {
        const res = await axios.get(
            "https://devpost.com/api/hackathons?status=upcoming&page=1", { headers: { "User-Agent": "Mozilla/5.0" } }
        );

        const items = res.data ?.hackathons || [];

        const events = items.map(ev => ({
            title: ev.title,
            date: ev.submission_period_dates,
            location: ev.virtual ? "Online" : ev.location,
            registrationLink: ev.url,
            description: ev.summary,
            image: ev.thumbnail_url,
            platform: "Devpost"
        }));

        console.log("Devpost →", events.length);
        return events;
    } catch (err) {
        console.log("❌ Devpost error:", err.message);
        return [];
    }
};

export default scrapeDevpost;