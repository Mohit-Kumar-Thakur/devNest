import axios from "axios";

const scrapeUnstop = async() => {
    try {
        const res = await axios.get(
            "https://api.unstop.com/api/public/opportunity/search?types=hackathon&page=1", { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
        );

        const items = res.data ?.data ?.data || [];

        console.log("Unstop →", items.length);

        const normalized = items.map(ev => {
            let link = null;

            if (ev.seo_url && typeof ev.seo_url === "string" && ev.seo_url.trim()) {
                link = ev.seo_url.startsWith("http") ?
                    ev.seo_url :
                    `https://unstop.com/${ev.seo_url.replace(/^\/+/, "")}`;
            } else if (ev.public_url && typeof ev.public_url === "string" && ev.public_url.trim()) {
                link = `https://unstop.com/${ev.public_url.replace(/^\/+/, "")}`;
            } else if (ev.regn_url && typeof ev.regn_url === "string" && ev.regn_url.trim()) {
                link = ev.regn_url.startsWith("http") ?
                    ev.regn_url :
                    `https://unstop.com/${ev.regn_url.replace(/^\/+/, "")}`;
            } else if (ev.seo && typeof ev.seo === "string" && ev.seo.trim()) {
                link = ev.seo.startsWith("http") ?
                    ev.seo :
                    `https://unstop.com/${ev.seo.replace(/^\/+/, "")}`;
            } else {
                link = null;
            }

            if (typeof link === "string" && link.includes("undefined")) link = null;

            let image = null;
            if (ev.banner_mobile ?.image_url) image = ev.banner_mobile.image_url;
            else if (ev.banner ?.image_url) image = ev.banner.image_url;
            else if (ev.logoUrl2) image = ev.logoUrl2;
            else if (ev.logoUrl) image = ev.logoUrl;

            const location =
                ev.city ||
                ev.state ||
                ev.country ||
                ev.region ||
                ev.location ||
                (ev.type === "online" ? "Online" : null);

            return {
                title: ev.title || ev.name || "",
                date: ev.start_date || ev.start || ev.display_date || "",
                organizer: ev.organisation ?.name ||
                    ev.organization_name ||
                    ev.organisation_name ||
                    null,
                location,
                registrationLink: link,
                image,
                platform: "Unstop",
                description: ev.short_description ||
                    ev.description ||
                    (ev.filters && ev.filters.map(f => f.name).join(", ")) ||
                    ""
            };
        });

        if (normalized.length > 0) console.log("UNSTOP SAMPLE:", normalized[0]);

        return normalized;
    } catch (err) {
        console.log("Unstop Error:", err.message);
        return [];
    }
};

export default scrapeUnstop;