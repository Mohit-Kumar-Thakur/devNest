import React, { useState, useRef, useEffect } from "react";
import { sendToGroq } from "./api";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

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
  const fabRef = useRef<HTMLButtonElement | null>(null);

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

  // Entrance animation
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

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        ref={fabRef}
        className="dn-chat-fab"
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 40px hsl(var(--primary) / 0.3)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 1000,
          transform: open ? 'scale(0.9) rotate(90deg)' : 'scale(1) rotate(0deg)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = open ? 'scale(0.9) rotate(90deg)' : 'scale(1.1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2), 0 0 60px hsl(var(--primary) / 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = open ? 'scale(0.9) rotate(90deg)' : 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 40px hsl(var(--primary) / 0.3)';
        }}
      >
        {open ? (
          <X className="w-7 h-7 text-white" style={{ transition: 'all 0.3s' }} />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" style={{ transition: 'all 0.3s' }} />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className="dn-chat-panel"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '420px',
          maxWidth: 'calc(100vw - 48px)',
          height: '600px',
          maxHeight: 'calc(100vh - 140px)',
          background: 'hsl(var(--card))',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '1px solid hsl(var(--border))',
        }}
      >
        {/* Header */}
        <div
          className="dn-chat-header"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid hsl(var(--border) / 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  letterSpacing: '-0.01em',
                }}
              >
                DevNest Mentor
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '2px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#4ade80',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="dn-chat-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                color: 'hsl(var(--muted-foreground))',
                padding: '40px 20px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  borderRadius: '20px',
                  background: 'hsl(var(--primary) / 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
                Hi! I'm DevNest Mentor
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                I'm here to help you with roadmaps, learning plans, and career guidance. Ask me anything!
              </p>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const html =
              m.role === "assistant"
                ? markdownToHtml(m.content)
                : `<p>${escapeHtml(m.content)}</p>`;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  animation: 'slideIn 0.3s ease-out',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isUser
                      ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)'
                      : 'hsl(var(--secondary))',
                    color: isUser ? 'white' : 'hsl(var(--foreground))',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    boxShadow: isUser
                      ? '0 4px 12px hsl(var(--primary) / 0.2)'
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '12px 20px',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'hsl(var(--secondary))',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                }}
              >
                <span className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--primary))', animation: 'typing 1.4s ease-in-out infinite' }} />
                <span className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--primary))', animation: 'typing 1.4s ease-in-out 0.2s infinite' }} />
                <span className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'hsl(var(--primary))', animation: 'typing 1.4s ease-in-out 0.4s infinite' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div
          className="dn-chat-footer"
          style={{
            padding: '16px 20px',
            borderTop: '1px solid hsl(var(--border))',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end',
            background: 'hsl(var(--background))',
          }}
        >
          <input
            ref={inputRef}
            placeholder="Ask DevNest Mentor…"
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--primary))';
              e.currentTarget.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--border))';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px hsl(var(--primary) / 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px hsl(var(--primary) / 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px hsl(var(--primary) / 0.3)';
            }}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .dn-chat-body::-webkit-scrollbar {
          width: 6px;
        }

        .dn-chat-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .dn-chat-body::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 3px;
        }

        .dn-chat-body::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }

        /* Markdown Styles - Enhanced Readability */
        .dn-chat-body h1,
        .dn-chat-body h2,
        .dn-chat-body h3 {
          font-weight: 700;
          line-height: 1.3;
          color: hsl(var(--foreground));
          margin-top: 20px;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .dn-chat-body h1 { 
          font-size: 22px;
          border-bottom: 2px solid hsl(var(--primary) / 0.2);
          padding-bottom: 8px;
        }
        
        .dn-chat-body h2 { 
          font-size: 19px;
          color: hsl(var(--primary));
          position: relative;
          padding-left: 12px;
        }
        
        .dn-chat-body h2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 3px;
          background: hsl(var(--primary));
          border-radius: 2px;
        }
        
        .dn-chat-body h3 { 
          font-size: 16px;
          color: hsl(var(--foreground) / 0.9);
          font-weight: 600;
        }

        .dn-chat-body ul {
          margin: 12px 0;
          padding-left: 24px;
          list-style-type: none;
        }

        .dn-chat-body li {
          margin: 8px 0;
          line-height: 1.7;
          position: relative;
          padding-left: 4px;
        }

        .dn-chat-body li::before {
          content: '▪';
          color: hsl(var(--primary));
          font-size: 16px;
          position: absolute;
          left: -20px;
          top: 0;
        }

        .dn-chat-body code.md-inline {
          background: hsl(var(--primary) / 0.15);
          color: hsl(var(--primary));
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 13px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-weight: 500;
          border: 1px solid hsl(var(--primary) / 0.2);
        }

        .dn-chat-body pre.md-code {
          background: hsl(var(--muted) / 0.5);
          padding: 16px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 16px 0;
          border: 1px solid hsl(var(--border));
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .dn-chat-body pre.md-code code {
          font-size: 13px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          line-height: 1.6;
          color: hsl(var(--foreground));
        }

        .dn-chat-body a {
          color: hsl(var(--primary));
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid hsl(var(--primary) / 0.3);
          transition: all 0.2s;
        }

        .dn-chat-body a:hover {
          border-bottom-color: hsl(var(--primary));
          color: hsl(var(--primary));
        }

        .dn-chat-body strong {
          font-weight: 700;
          color: hsl(var(--foreground));
        }

        .dn-chat-body em {
          font-style: italic;
          color: hsl(var(--foreground) / 0.9);
        }

        .dn-chat-body p {
          margin: 10px 0;
          line-height: 1.7;
          color: hsl(var(--foreground) / 0.95);
        }

        .dn-chat-body p:first-child {
          margin-top: 0;
        }

        .dn-chat-body p:last-child {
          margin-bottom: 0;
        }

        /* Better spacing between sections */
        .dn-chat-body > div {
          margin-bottom: 4px;
        }
      `}</style>
    </>
  );
}