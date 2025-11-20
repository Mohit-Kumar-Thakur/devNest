import axios from "axios";

const scrapePWCode = async() => {
    try {
        const res = await axios.get("https://paperswithcode.com/api/v1/competitions/");

        const items = res.data ?.results || [];

        const events = items.map(ev => ({
            title: ev.title,
            date: ev.deadline,
            location: "Online",
            registrationLink: ev.url,
            description: ev.description || "AI/ML competition",
            image: null,
            platform: "PapersWithCode"
        }));

        return events;
    } catch (err) {
        console.log("❌ PWCode error:", err.message);
        return [];
    }
};

export default scrapePWCode;