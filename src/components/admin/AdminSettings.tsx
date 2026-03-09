import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check, X } from "lucide-react";

interface TeamMember {
  id: string;
  email: string;
  role: "team" | "admin";
  status: "active" | "pending";
}

export function AdminSettings() {
  const [team, setTeam] = useState<TeamMember[]>([
    { id: "1", email: "felipe@yourmeasured.com", role: "admin", status: "active" },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/measured");
  const [polycamUrl, setPolycamUrl] = useState("https://poly.cam/capture");
  const [refundText, setRefundText] = useState(
    "Full refund if cancelled before brief submission. 40% refund if cancelled after brief submission. No refund after first draft delivery."
  );

  const inviteMember = () => {
    if (!newEmail.trim()) return;
    setTeam((prev) => [
      ...prev,
      { id: crypto.randomUUID(), email: newEmail.trim(), role: "team", status: "pending" },
    ]);
    setNewEmail("");
  };

  const removeMember = (id: string) => setTeam((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-medium text-foreground tracking-wide">Settings</h2>

      {/* Team */}
      <section className="border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Team Members</h3>
        <p className="text-sm text-muted-foreground font-light">
          Team members can view projects, briefs, and upload files — but cannot see financial data.
        </p>
        <div className="space-y-2">
          {team.map((m) => (
            <div key={m.id} className="flex items-center justify-between border border-border rounded-lg p-3">
              <div>
                <span className="text-sm text-foreground">{m.email}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  m.role === "admin" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
                }`}>
                  {m.role}
                </span>
                {m.status === "pending" && (
                  <span className="ml-2 text-xs text-muted-foreground">Pending</span>
                )}
              </div>
              {m.role !== "admin" && (
                <button onClick={() => removeMember(m.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Email address" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          <Button variant="outline" size="sm" onClick={inviteMember}>
            <Plus className="w-4 h-4 mr-1" /> Invite
          </Button>
        </div>
      </section>

      {/* Integrations */}
      <section className="border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Integrations</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-wide uppercase">Calendly URL</label>
            <Input value={calendlyUrl} onChange={(e) => setCalendlyUrl(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-wide uppercase">Polycam URL</label>
            <Input value={polycamUrl} onChange={(e) => setPolycamUrl(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm font-medium text-foreground">HubSpot</div>
            <div className="text-xs text-muted-foreground mt-1 font-light">Not connected</div>
            <Button variant="outline" size="sm" className="mt-2">Connect</Button>
          </div>
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm font-medium text-foreground">QuickBooks</div>
            <div className="text-xs text-muted-foreground mt-1 font-light">Not connected</div>
            <Button variant="outline" size="sm" className="mt-2">Connect</Button>
          </div>
          <div className="border border-border rounded-lg p-4">
            <div className="text-sm font-medium text-foreground">Stripe</div>
            <div className="text-xs text-muted-foreground mt-1 font-light">Not connected</div>
            <Button variant="outline" size="sm" className="mt-2">Connect</Button>
          </div>
        </div>
      </section>

      {/* Email Automation */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">Email & SMS Automation (HubSpot)</h3>
        <p className="text-sm text-muted-foreground font-light">
          Connect HubSpot to enable automated notifications.
        </p>
        <div className="space-y-2 text-sm">
          {[
            "Payment confirmed → welcome email + dashboard link",
            "Brief submitted → confirmation to client + notification to admin",
            "Admin uploads draft → email + SMS to client",
            "Client requests revision → notification to admin",
            "Admin uploads revision → email + SMS to client",
            "Client approves → confirmation email + notification to admin",
            "Final delivery → email + SMS + review request form",
            "Review request → sent 24h after delivery",
          ].map((flow, i) => (
            <div key={i} className="flex items-center gap-2 p-2 border border-border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground font-light">{flow}</span>
            </div>
          ))}
        </div>
      </section>

      <Button variant="hero" className="w-full">Save settings</Button>
    </div>
  );
}
