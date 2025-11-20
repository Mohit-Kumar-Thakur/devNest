import launchBrowser from "./browser.js";

const scrapeMLH = async() => {
    try {
        const browser = await launchBrowser();
        const page = await browser.newPage();

        await page.goto("https://mlh.io/seasons/2025/events", {
            waitUntil: "networkidle2"
        });

        const events = await page.evaluate(() => {
            const cards = document.querySelectorAll(".event-wrapper");

            return Array.from(cards).map(card => ({
                title: card.querySelector("h3") ?.innerText || "",
                date: card.querySelector(".event-date") ?.innerText || "",
                location: card.querySelector(".event-location") ?.innerText || "",
                registrationLink: card.querySelector("a") ?.href || null,
                description: "",
                image: card.querySelector("img") ?.src || "",
                platform: "MLH"
            }));
        });

        await browser.close();
        return events;
    } catch (err) {
        console.log("❌ MLH Puppeteer error:", err.message);
        return [];
    }
};

export default scrapeMLH;