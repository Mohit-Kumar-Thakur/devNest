import React, { useState, useRef, useEffect } from "react";
import { sendToGroq } from "./api"; // Ensure this path is correct for your project
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import "./chat.css"; // Import the new styles

// Escape HTML
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Minimal markdown → HTML converter
function markdownToHtml(md: string) {
  let s = escapeHtml(md);

  // Code blocks
  s = s.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="md-code"><code>${escapeHtml(code)}</code></pre>`;
  });

  // Inline code
  s = s.replace(/`([^`]+?)`/g, "<code class=\"md-inline\">$1</code>");

  // Bold
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italics
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

  // Headings
  s = s.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  s = s.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  s = s.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Links
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Lists
  s = s.replace(/^(?:- |\* )(.*)/gim, "<li>$1</li>");
  s = s.replace(/(<li>[\s\S]*?<\/li>)/gim, "<ul>$1</ul>");

  // Line breaks
  s = s.replace(/\n{2,}/g, "</p><p>");
  s = s.replace(/\n/g, "<br>");

  return `<p>${s}</p>`;
}

type Role = "user" | "assistant" | "system";
type Message = { role: Role; content: string };

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Spotlight Effect Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current || !open) return;
      
      const rect = panelRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      panelRef.current.style.setProperty("--x", x.toString());
      panelRef.current.style.setProperty("--y", y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [open]);

  // Auto scroll
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Entrance focus
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  const sendMessage = async () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    if (inputRef.current) inputRef.current.value = "";

    setLoading(true);

    try {
      const mentorSystemPrompt: Message = {
        role: "system",
        content: `You are DevNest Mentor — an expert guiding students & professionals.
Your job:
- Ask users about skills, semester, goals.
- Create tailored roadmaps.
- Give job switch suggestions.
- Provide learning plans (7-day, 30-day, 90-day).
- Use headings, bullet points, clean formatting.
Always reply in friendly, well-structured markdown.`
      };

      const payload = [mentorSystemPrompt, ...messages, userMsg];
      const res = await sendToGroq(payload);

      const reply =
        res?.choices?.[0]?.message?.content ??
        res?.choices?.[0]?.text ??
        "No response received.";

      const botMsg: Message = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: " + err.message },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        className={`dn-chat-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        title={open ? "Close Chat" : "Open Mentor Chat"}
      >
        {open ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>

      {/* Chat Panel (Glass Window) */}
      <div
        ref={panelRef}
        className={`dn-chat-panel ${open ? 'open' : ''}`}
      >
        {/* Header */}
        <div className="dn-chat-header">
          <div className="dn-header-info">
            <div className="dn-bot-icon">
              <Sparkles className="w-5 h-5 text-[#07eae6]" />
            </div>
            <div>
              <div className="dn-bot-title">DevNest Mentor</div>
              <div className="dn-bot-status">
                <span className="status-dot" />
                Online
              </div>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body / Messages */}
        <div className="dn-chat-body">
          {messages.length === 0 && (
            <div className="dn-empty-state">
              <div style={{ 
                background: 'rgba(7, 234, 230, 0.1)', 
                width: 60, height: 60, borderRadius: 16, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <Sparkles className="w-8 h-8 text-[#07eae6]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Hi! I'm DevNest Mentor</h3>
              <p className="text-sm px-4">
                I'm here to help you with roadmaps, learning plans, and career guidance. Ask me anything!
              </p>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const html = m.role === "assistant"
                ? markdownToHtml(m.content)
                : `<p>${escapeHtml(m.content)}</p>`;

            return (
              <div
                key={i}
                className={`dn-msg ${isUser ? "dn-msg-user" : "dn-msg-bot"}`}
              >
                <div
                  className="dn-msg-content"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          })}

          {loading && (
            <div className="dn-msg dn-msg-bot">
              <div className="dn-msg-content" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input */}
        <div className="dn-chat-footer">
          <input
            ref={inputRef}
            className="dn-chat-input"
            placeholder="Ask DevNest Mentor..."
            onKeyDown={handleKeyDown}
          />
          <button className="dn-chat-send" onClick={sendMessage}>
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </>
  );
}