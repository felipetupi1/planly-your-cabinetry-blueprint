import { ClipboardList, CreditCard, Upload, FileCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Select your space and size",
    description: "Choose your rooms and pick the right size using our built-in calculator.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    description: "Check out with Stripe. Multi-space discounts applied automatically.",
  },
  {
    icon: Upload,
    title: "Submit your brief",
    description: "Upload photos, floor plans, measurements, and references.",
  },
  {
    icon: FileCheck,
    title: "Receive your project",
    description: "Get construction-ready documents in 7 business days. Ready to bid.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          How it works
        </h2>
        <div className="mt-16 grid md:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <step.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="mt-3 text-xs font-medium text-muted-foreground tracking-widest uppercase">
                Step {i + 1}
              </div>
              <h3 className="mt-3 text-lg font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
