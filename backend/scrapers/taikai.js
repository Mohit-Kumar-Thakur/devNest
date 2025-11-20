import launchBrowser from "./browser.js";

const scrapeTaikai = async() => {
    try {
        const browser = await launchBrowser();
        const page = await browser.newPage();

        await page.goto("https://taikai.network/challenges", {
            waitUntil: "networkidle2"
        });

        const events = await page.evaluate(() => {
            const cards = document.querySelectorAll(".challenge-card");

            return Array.from(cards).map(el => ({
                title: el.querySelector(".challenge-name") ?.innerText || "",
                date: el.querySelector(".date") ?.innerText || "",
                location: "Global",
                registrationLink: el.querySelector("a") ?.href || null,
                description: "",
                image: el.querySelector("img") ?.src || "",
                platform: "Taikai"
            }));
        });

        await browser.close();
        return events;
    } catch (err) {
        console.log("❌ Taikai Puppeteer error:", err.message);
        return [];
    }
};

export default scrapeTaikai;