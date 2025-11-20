import axios from "axios";
import cheerio from "cheerio";

const scrapeHackathonDotCom = async() => {
    const url = "https://www.hackathon.com/country/india";

    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        const events = [];

        $(".event-item").each((i, el) => {
            events.push({
                title: $(el).find(".event-title").text().trim(),
                date: $(el).find(".event-date").text().trim(),
                location: $(el).find(".event-location").text().trim(),
                registrationLink: "https://www.hackathon.com" + $(el).find("a").attr("href"),
                description: "Listed on Hackathon.com",
                image: $(el).find("img").attr("src"),
                platform: "Hackathon.com"
            });
        });

        console.log("Hackathon.com fetched:", events.length);
        return events;
    } catch (err) {
        console.log("❌ Hackathon.com error:", err.message);
        return [];
    }
};

export default scrapeHackathonDotCom;