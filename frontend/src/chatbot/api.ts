// api.ts
export async function sendToGroq(messages: any[]) {
  // Use absolute backend host if you prefer: 'http://localhost:5000/api/groq/chat'
  const url = process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/groq/chat"
    : "/api/groq/chat";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  // Try parsing the response as JSON even for error responses
  let data: any;
  try {
    data = await res.json();
  } catch (parseErr) {
    // If parsing fails, return raw text for debugging
    const text = await res.text();
    throw new Error(`Invalid JSON response from server: ${text}`);
  }

  if (!res.ok) {
    // data.error might be a string or object — normalize to string
    const errMsg =
      typeof data?.error === "string"
        ? data.error
        : data?.error?.message || JSON.stringify(data);
    throw new Error(errMsg || "Groq request failed");
  }

  return data;
}
