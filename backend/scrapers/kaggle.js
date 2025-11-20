import axios from "axios";

const scrapeKaggle = async() => {
    try {
        const res = await axios.get(
            "https://www.kaggle.com/api/v1/competitions/list", { headers: { "User-Agent": "Mozilla/5.0" } }
        );

        const events = res.data.map(c => ({
            title: c.title,
            date: c.deadline,
            location: "Online",
            registrationLink: "https://www.kaggle.com/competitions/" + c.ref,
            description: c.subtitle || "Kaggle competition",
            image: null,
            platform: "Kaggle"
        }));

        console.log("Kaggle →", events.length);
        return events;
    } catch (err) {
        console.log("❌ Kaggle error:", err.message);
        return [];
    }
};

export default scrapeKaggle;