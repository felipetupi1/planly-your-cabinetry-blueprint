import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need to find my own cabinetmaker?",
    a: "Yes — and that's the point. With Measured, you bring the project to any cabinetmaker you want. The design belongs to you, not to whoever you're going to hire. You get to compare, negotiate, and decide.",
  },
  {
    q: "How long does the whole process take?",
    a: "You'll have your first draft within 7 business days of submitting your brief. Each revision round takes up to 3 business days. Final construction documents are delivered within 5 business days after your last approval.",
  },
  {
    q: "What do I need to provide?",
    a: "Photos of the space, approximate measurements, and a sense of what you like. No architectural experience required — we guide you through the brief step by step.",
  },
  {
    q: "Can I use the project with any cabinetmaker?",
    a: "Absolutely. The files are yours. PDF and DWG formats are industry-standard — any professional cabinetmaker or carpenter can work from them.",
  },
  {
    q: "What happens after 2 revision rounds?",
    a: "The project is considered approved and final files are released. Additional revision rounds can be requested for a small fee — pricing varies by space size.",
  },
  {
    q: "What if I don't have a floor plan?",
    a: "Photos and measurements are enough. We'll take it from there.",
  },
  {
    q: "Are the measurements in my project exact?",
    a: "Your project is developed based on the measurements you provide and is designed to give you and your cabinetmaker a clear, professional reference for quoting and planning. Before fabrication begins, your cabinetmaker should always conduct an on-site final measurement visit — especially to plan trims, transitions, and finishing details specific to your space.",
  },
  {
    q: "What is your refund policy?",
    a: "Full refund if cancelled before brief submission. 40% refund if cancelled after brief submission. No refund after first draft delivery.",
  },
  {
    q: "Do you work with architects and interior designers?",
    a: "Absolutely. Many of our clients are designers who need construction-ready documents for their cabinetry projects. We handle the technical documentation so you can focus on design.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-6 h-px bg-accent" />
          <span className="text-xs tracking-widest uppercase text-accent font-medium">
            Questions
          </span>
          <div className="w-6 h-px bg-accent" />
        </div>

        <h2 className="text-3xl md:text-4xl font-light text-center text-foreground tracking-wide">
          Frequently asked questions
        </h2>

        <Accordion type="single" collapsible className="mt-12 border-t border-border">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border py-2">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline tracking-wide py-3">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed font-light pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}