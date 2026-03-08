import { FileText, Ruler, RefreshCcw, Clock } from "lucide-react";

const items = [
  { icon: Ruler, text: "Floor plan, sections, and elevations" },
  { icon: FileText, text: "Construction-ready documents (PDF + DWG)" },
  { icon: RefreshCcw, text: "2 rounds of revisions" },
  { icon: Clock, text: "5 business day delivery" },
];

export function WhatsIncluded() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground">
          What's included
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-background rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground font-medium pt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
