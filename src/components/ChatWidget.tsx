import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-widget-panel" role="dialog" aria-label="Chat support">
          <div className="chat-widget-header">
            <span>ShopNest Support</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={16} />
            </button>
          </div>
          <div className="chat-widget-body">
            <div className="chat-widget-bubble">
              👋 Hi! This is a portfolio demo, so live chat isn't connected to a real support
              team — but feel free to look around ShopNest.
            </div>
          </div>
          <div className="chat-widget-input">
            <input type="text" placeholder="Chat isn't wired up in this demo" disabled />
            <button type="button" disabled aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="chat-widget-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
