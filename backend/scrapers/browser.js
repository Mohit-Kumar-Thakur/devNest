import puppeteer from "puppeteer";

const launchBrowser = async() => {
    return await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
};

export default launchBrowser;