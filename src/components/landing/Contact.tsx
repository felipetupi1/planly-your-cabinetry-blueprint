import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — will integrate with HubSpot
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          Get in touch
        </h2>

        <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <a href="mailto:hello@yourmeasured.com" className="text-sm hover:text-accent transition-colors tracking-wide">
            hello@yourmeasured.com
          </a>
        </div>

        {sent ? (
          <div className="mt-10 border border-border rounded-lg p-8 text-center">
            <p className="text-foreground font-medium">Message sent!</p>
            <p className="mt-2 text-sm text-muted-foreground font-light">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <Button variant="hero" type="submit" className="w-full">
              Send message
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
