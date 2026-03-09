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
    q: "Should I measure door and window trim?",
    a: "Yes. Trim, casings, and baseboards affect how cabinetry fits. Our guide shows you exactly what to measure.",
  },
  {
    q: "Can I use the project with any cabinetmaker?",
    a: "Yes — that's the whole point. Take your documents to any cabinetmaker and get accurate, comparable quotes.",
  },
  {
    q: "What happens after 2 revision rounds?",
    a: "The project is considered approved and final files are released for download.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
