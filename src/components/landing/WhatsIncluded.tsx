import { FileText, Ruler, RefreshCcw, Clock, ShoppingCart } from "lucide-react";

const items = [
  { icon: Ruler, text: "Floor plan, sections, and elevations" },
  { icon: FileText, text: "Construction-ready documents (PDF + DWG)" },
  { icon: RefreshCcw, text: "2 rounds of revisions with approval required at each stage" },
  { icon: Clock, text: "7 business day delivery from payment" },
  { icon: ShoppingCart, text: "Option to purchase additional revision rounds" },
];

export function WhatsIncluded() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          What's included
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-background rounded-lg border border-border">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-foreground font-light pt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
