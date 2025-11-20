import launchBrowser from "./browser.js";

const scrapeGitHubEvents = async() => {
    try {
        const browser = await launchBrowser();
        const page = await browser.newPage();

        await page.goto("https://github.com/events", {
            waitUntil: "networkidle2"
        });

        const events = await page.evaluate(() => {
            const cards = document.querySelectorAll(".Box-row");

            return Array.from(cards).map(el => ({
                title: el.querySelector("strong") ?.innerText || "",
                date: el.querySelector("relative-time") ?.getAttribute("datetime") || "",
                location: el.querySelector(".color-fg-muted") ?.innerText || "",
                registrationLink: el.querySelector("a") ?.href || null,
                description: "",
                image: null,
                platform: "GitHub"
            }));
        });

        await browser.close();
        return events;
    } catch (err) {
        console.log("❌ GitHub Events Puppeteer error:", err.message);
        return [];
    }
};

export default scrapeGitHubEvents;