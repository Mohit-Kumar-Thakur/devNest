import axios from "axios";

const scrapeAICrowd = async() => {
    try {
        const res = await axios.get("https://www.aicrowd.com/challenges.json", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const items = res.data ?.challenges || [];

        const events = items.map(ev => ({
            title: ev.title,
            date: ev.deadline,
            location: "Online",
            registrationLink: `https://www.aicrowd.com/challenges/${ev.slug}`,
            description: ev.description || "AIcrowd competition",
            image: ev.logo_url,
            platform: "AIcrowd"
        }));

        console.log("AIcrowd →", events.length);
        return events;
    } catch (err) {
        console.log("❌ AIcrowd error:", err.message);
        return [];
    }
};

export default scrapeAICrowd;