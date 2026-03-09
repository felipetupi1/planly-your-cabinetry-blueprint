import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";

export function AdminCMS() {
  const [hero, setHero] = useState({
    headline: "Your space, measured. Ready to build.",
    subheadline: "Get a professional cabinetry project online — so you can get accurate quotes and negotiate with any cabinetmaker. No surprises.",
    cta: "Start your project",
  });

  const [steps, setSteps] = useState([
    { title: "Select your space and size", description: "Choose your rooms and pick the right size using our built-in calculator." },
    { title: "Pay securely", description: "Check out with Stripe. Multi-space discounts applied automatically." },
    { title: "Submit your brief", description: "Upload photos, floor plans, measurements, and references." },
    { title: "Receive your project", description: "Get construction-ready documents in 7 business days. Ready to bid." },
  ]);

  const [deliverables, setDeliverables] = useState([
    "Floor plan, sections, and elevations",
    "Construction-ready documents (PDF + DWG)",
    "2 rounds of revisions with approval required at each stage",
    "7 business day delivery from payment",
    "Option to purchase additional revision rounds",
  ]);

  const [faqs, setFaqs] = useState([
    { q: "What if I don't have a floor plan?", a: "Photos and measurements are enough." },
    { q: "How do I know what size my space is?", a: "Use our built-in calculator." },
    { q: "Can I use the project with any cabinetmaker?", a: "Yes — that's the whole point." },
  ]);

  const [contactEmail, setContactEmail] = useState("hello@yourmeasured.com");

  const [refundPolicy, setRefundPolicy] = useState(
    "Full refund if cancelled before brief submission. 40% refund if cancelled after brief submission. No refund after first draft delivery."
  );

  const [seo, setSeo] = useState({
    title: "Measured — Professional Cabinetry Projects Online",
    description: "Get construction-ready cabinetry documents delivered in 7 business days. Professional millwork design for any space.",
    ogImage: "",
  });

  const [newDeliverable, setNewDeliverable] = useState("");

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-medium text-foreground tracking-wide">Site Content Manager</h2>

      {/* Hero */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">Hero</h3>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">Headline</label>
          <Input value={hero.headline} onChange={(e) => setHero((p) => ({ ...p, headline: e.target.value }))} className="mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">Subheadline</label>
          <textarea
            value={hero.subheadline}
            onChange={(e) => setHero((p) => ({ ...p, subheadline: e.target.value }))}
            rows={2}
            className="mt-1 w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">CTA Button Text</label>
          <Input value={hero.cta} onChange={(e) => setHero((p) => ({ ...p, cta: e.target.value }))} className="mt-1" />
        </div>
      </section>

      {/* How It Works */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">How It Works</h3>
        {steps.map((step, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Input
              value={step.title}
              onChange={(e) => setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)))}
              placeholder={`Step ${i + 1} title`}
            />
            <Input
              value={step.description}
              onChange={(e) => setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, description: e.target.value } : s)))}
              placeholder={`Step ${i + 1} description`}
            />
          </div>
        ))}
      </section>

      {/* What's Included */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">What's Included</h3>
        {deliverables.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={d}
              onChange={(e) => setDeliverables((prev) => prev.map((item, j) => (j === i ? e.target.value : item)))}
            />
            <button onClick={() => setDeliverables((prev) => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input placeholder="Add deliverable" value={newDeliverable} onChange={(e) => setNewDeliverable(e.target.value)} />
          <Button variant="outline" size="sm" onClick={() => { if (newDeliverable.trim()) { setDeliverables((p) => [...p, newDeliverable.trim()]); setNewDeliverable(""); } }}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">FAQ</h3>
          <Button variant="outline" size="sm" onClick={() => setFaqs((p) => [...p, { q: "", a: "" }])}>
            <Plus className="w-4 h-4 mr-1" /> Add FAQ
          </Button>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="flex items-start gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-3 flex-shrink-0 cursor-grab" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input value={faq.q} onChange={(e) => setFaqs((prev) => prev.map((f, j) => (j === i ? { ...f, q: e.target.value } : f)))} placeholder="Question" />
              <Input value={faq.a} onChange={(e) => setFaqs((prev) => prev.map((f, j) => (j === i ? { ...f, a: e.target.value } : f)))} placeholder="Answer" />
            </div>
            <button onClick={() => setFaqs((prev) => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive mt-3">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      {/* Contact */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">Contact</h3>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">Email Address</label>
          <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1" />
        </div>
      </section>

      {/* Refund Policy */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">Refund Policy</h3>
        <textarea
          value={refundPolicy}
          onChange={(e) => setRefundPolicy(e.target.value)}
          rows={3}
          className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <p className="text-xs text-muted-foreground font-light">Updates FAQ and checkout page simultaneously.</p>
      </section>

      {/* SEO */}
      <section className="border border-border rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-medium text-foreground">SEO Settings</h3>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">Meta Title</label>
          <Input value={seo.title} onChange={(e) => setSeo((p) => ({ ...p, title: e.target.value }))} className="mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">Meta Description</label>
          <textarea
            value={seo.description}
            onChange={(e) => setSeo((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="mt-1 w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wide uppercase">OG Image URL</label>
          <Input value={seo.ogImage} onChange={(e) => setSeo((p) => ({ ...p, ogImage: e.target.value }))} className="mt-1" placeholder="https://..." />
        </div>
      </section>

      <Button variant="hero" className="w-full">Save all changes</Button>
    </div>
  );
}
