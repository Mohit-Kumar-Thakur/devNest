import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

app.post("/api/message", (req, res) => {
    const { name, message } = req.body;
    res.json({ reply: `Hello ${name}, your message '${message}' was received!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));