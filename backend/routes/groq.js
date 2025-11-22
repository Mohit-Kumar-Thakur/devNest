import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * POST /api/groq/chat
 * Body: { messages: [ { role: 'system'|'user'|'assistant', content: '...' }, ... ] }
 */
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages must be an array." });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in env");
      return res.status(500).json({
        error: "Server misconfiguration: GROQ_API_KEY not set.",
      });
    }

    // Prepare payload — keep it minimal; you can extend with max_tokens, temperature etc.
    const payload = {
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages,
    };

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    // Forward the provider's data to client (safe)
    return res.status(response.status || 200).json(response.data);
  } catch (err) {
    // Normalize and log error
    console.error("Groq error (raw):", err);

    // If axios error with response (non-2xx), use that info
    if (err?.response) {
      const { status, data } = err.response;
      console.error("Groq response error:", status, data);
      // return the provider error message (string) if present, else the data object
      const message =
        data?.error?.message ||
        data?.message ||
        (typeof data === "string" ? data : JSON.stringify(data));
      return res.status(status || 500).json({ error: message });
    }

    // Other errors (timeout, network, coding error)
    const message = err?.message || "Internal server error";
    return res.status(500).json({ error: message });
  }
});

export default router;
