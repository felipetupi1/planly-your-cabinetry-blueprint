import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What if I don't have a floor plan?",
    a: "No problem. Photos and rough dimensions are enough for us to get started. We'll create the floor plan for you.",
  },
  {
    q: "What size is my space?",
    a: "Measure the length and width of your room in feet and multiply them. For example, a 10 × 12 ft room is 120 sq/ft — that's a Medium.",
  },
  {
    q: "Can I use the project with any cabinetmaker?",
    a: "Yes — that's the whole point. Your construction documents are standard and can be bid by any qualified cabinetmaker.",
  },
  {
    q: "What happens after 2 revision rounds?",
    a: "After 2 rounds of revisions — or once you approve — the project is considered delivered. Additional revisions can be arranged separately.",
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
