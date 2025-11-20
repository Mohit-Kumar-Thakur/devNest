import axios from "axios";

const scrapeDevfolio = async() => {
    try {
        const res = await axios.get(
            "https://devfolio.co/api/hackathons/search?query=&limit=50"
        );

        const items = res.data ?.result || [];

        console.log("Devfolio fetched:", items.length);

        return items.map(ev => ({
            title: ev.name,
            date: ev.start_time,
            location: ev.city || "Online",
            registrationLink: `https://devfolio.co/hackathons/${ev.slug}`,
            description: ev.short_description || "Devfolio Hackathon",
            image: ev.cover_image || ev.logo,
            platform: "Devfolio"
        }));
    } catch (err) {
        console.log("❌ Devfolio error:", err.message);
        return [];
    }
};

export default scrapeDevfolio;