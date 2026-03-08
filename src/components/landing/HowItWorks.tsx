import { ClipboardList, Upload, FileCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Select your space and pay",
    description: "Choose your rooms, pick the sizes, and check out securely.",
  },
  {
    icon: Upload,
    title: "Submit your brief",
    description: "Upload photos, floor plans, and references. Tell us what you envision.",
  },
  {
    icon: FileCheck,
    title: "Receive your project",
    description: "Get construction-ready documents in 5 business days. Ready to bid.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground">
          How it works
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">Step {i + 1}</div>
              <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
