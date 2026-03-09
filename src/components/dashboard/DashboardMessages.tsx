import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  from: "client" | "admin";
  text: string;
  time: string;
}

const mockMessages: Message[] = [
  { from: "admin", text: "Welcome to your project! Feel free to ask any questions here.", time: "Mar 8, 10:00 AM" },
];

export function DashboardMessages() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");

  const send = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { from: "client", text: newMessage.trim(), time: "Just now" }]);
    setNewMessage("");
  };

  return (
    <div>
      <h2 className="text-2xl font-medium text-foreground tracking-wide">Messages</h2>
      <p className="mt-2 text-muted-foreground font-light">Quick questions and updates.</p>

      <div className="mt-6 border border-border rounded-lg overflow-hidden">
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 text-sm ${
                  msg.from === "client"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <p className="font-light">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === "client" ? "text-accent-foreground/60" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-3 flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="default" size="sm" onClick={send}>Send</Button>
        </div>
      </div>
    </div>
  );
}
