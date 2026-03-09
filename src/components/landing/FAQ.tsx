import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What if I don't have a floor plan?",
    a: "Photos and measurements are enough. We'll take it from there.",
  },
  {
    q: "How do I know what size my space is?",
    a: "Use our built-in calculator — just enter length and width and we'll figure it out.",
  },
  {
    q: "Do I need to measure ceiling height?",
    a: "Yes — especially if you want cabinetry that reaches the ceiling. Our measurement guide walks you through it.",
  },
  {
    q: "Can I use the project with any cabinetmaker?",
    a: "Yes — that's the whole point. Take your documents to any cabinetmaker and get accurate, comparable quotes.",
  },
  {
    q: "What happens after 2 revision rounds?",
    a: "The project is considered approved and final files are released for download.",
  },
  {
    q: "Can I get an additional revision?",
    a: "Yes. Additional revision rounds can be purchased from your dashboard. Pricing varies by space size: Small $65 / Medium $85 / Large $125.",
  },
  {
    q: "What is your refund policy?",
    a: "Full refund if cancelled before brief submission. 40% refund if cancelled after brief submission. No refund after first draft delivery.",
  },
  {
    q: "How long does it take?",
    a: "7 business days from payment to first draft delivery. Revisions are typically turned around within 3–5 business days.",
  },
  {
    q: "Are the measurements in my project exact?",
    a: "Your project is developed based on the measurements you provide and is designed to give you and your cabinetmaker a clear, professional reference for quoting and planning. Before fabrication begins, your cabinetmaker should always conduct an on-site final measurement visit — especially to plan trims, transitions, and finishing details specific to your space.",
  },
  {
    q: "Do you work with architects and interior designers?",
    a: "Absolutely. Many of our clients are designers who need construction-ready documents for their cabinetry projects. We handle the technical documentation so you can focus on design.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline tracking-wide">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed font-light">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
