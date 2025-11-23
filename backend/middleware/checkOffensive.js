// --- BILINGUAL BLOCK LIST (English + Hindi/Hinglish) ---
// This list covers common profanity, bullying, and abuse.
// Note: This checks for substrings, so be careful banning short words like "hell" (blocks "hello").

const BLOCK_LIST = [
    // --- ENGLISH ---
    "bullshit", "fuck", "fucker", "fucking", "mf", "motherfucker",
    "shit", "bitch", "asshole", "dick", "pussy", "bastard",
    "cunt", "whore", "slut", "douche", "stupid", "idiot",
    "kill", "murder", "suicide", "die", "terrorist",
    "rape", "molest", "nude", "sex", "porn", "xxx",
    "suck", "cock", "boobs", "vagina", "penis",

    // --- HINDI (HINGLISH) ---
    // Common spellings and variations
    "madarchod", "mc", "madarchod", 
    "bhenchod", "bc", "behenchod", "bhenkelode",
    "chutiya", "choot", "chu", "chootiya",
    "gandu", "gaand", "gand", 
    "bhosdike", "bsdk", "bhosda",
    "harami", "kutta", "kamina", "saala", "saale",
    "randi", "rand", "randwa",
    "lodu", "lowde", "laude", "loda",
    "tatte", "jhant", 
    "chinal", "kutiya", 
    "suar", "hijra", // (Context dependent, but often used abusively)
    "terimaa", "teri maa", "tmkc", "mkmkc"
];

const checkOffensive = (req, res, next) => {
    // 1. Get the text from any possible field
    const userText = req.body.text || req.body.content || req.body.caption || "";

    if (!userText) {
        return next();
    }

    // 2. Normalize: lowercase and remove special chars to catch "f.u.c.k"
    // This turns "HeLLo @World!" into "hello world"
    const cleanedText = userText.toLowerCase();

    // 3. CHECK: Does the text contain any word from our list?
    const foundBadWord = BLOCK_LIST.find(badWord => cleanedText.includes(badWord));

    if (foundBadWord) {
        console.log(`[BLOCKED] Offensive post detected. Trigger word: "${foundBadWord}"`);
        return res.status(400).json({
            success: false,
            message: "Your post contains inappropriate language/words and was not posted."
        });
    }

    // 4. If clean, proceed
    next();
};

export default checkOffensive;