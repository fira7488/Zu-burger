import { MessageSquare, X, Send } from "lucide-react";
import { useState } from "react";

function getBotReply(text) {
  const q = (text || "").toLowerCase();
  if (!q) return "Please ask a question or type something to get help.";
  if (q.includes("menu") || q.includes("burger") || q.includes("items"))
    return "You can browse the full menu on the Menu page and add items to your cart.";
  if (
    q.includes("checkout") ||
    q.includes("order") ||
    q.includes("place order")
  )
    return "Fill out the checkout form, choose a payment method, and place your order.";
  if (q.includes("payment") || q.includes("cbe") || q.includes("telebirr"))
    return "We accept Telebirr, CBEBirr, Chapa, bank transfer, and cash on delivery.";
  if (q.includes("open") || q.includes("hours") || q.includes("time"))
    return "The restaurant hours are indicated on the homepage and our contact section.";
  if (q.includes("location") || q.includes("where"))
    return "Zu Burger Spot is located in Shashemene, and you can order online through the site.";
  return "I am here to help with your order, menu items, and payment options.";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi there! Ask me about the menu, ordering, or payment options.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg = { from: "user", text };
    const botMsg = { from: "bot", text: getBotReply(text) };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div>
      <div className={`fixed right-6 bottom-6 z-50`}>
        {open && (
          <div className="mb-3 w-80 rounded-lg border border-zinc-200 bg-white shadow-lg">
            <div className="flex items-center justify-between rounded-t-lg bg-zinc-950 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                <span className="font-black">Zu Burger Assistant</span>
              </div>
              <button aria-label="Close chat" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto p-3 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 flex ${m.from === "bot" ? "items-start" : "justify-end"}`}
                >
                  <div
                    className={`${m.from === "bot" ? "bg-zinc-100 text-zinc-900" : "bg-yellow-100 text-zinc-900"} max-w-[80%] rounded-lg px-3 py-2`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={send}
              className="flex items-center gap-2 border-t border-zinc-200 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about ordering, delivery, or the menu"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-9 w-9 place-items-center rounded-full bg-red-800 text-white"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        <button
          aria-label="Open chat"
          onClick={() => setOpen((s) => !s)}
          className="grid h-12 w-12 place-items-center rounded-full bg-red-800 text-white shadow-lg"
        >
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
}
