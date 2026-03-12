import { ClipboardList, Star, Users } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Choose your space",
    description:
      "Kitchen, closet, home office — pick the room and describe what you have in mind. Takes 2 minutes.",
    detail: null,
  },
  {
    icon: Star,
    title: "We design your project",
    description:
      "A professional delivers your first draft, incorporates your feedback, and finalizes construction-ready documents.",
    detail: "First draft · 7 business days · Revisions · 3 days each · Final docs · 5 days after approval",
  },
  {
    icon: Users,
    title: "You walk in in control",
    description:
      "Take your project to any cabinetmaker. Compare quotes with the same specs. Decide on your terms — not theirs.",
    detail: null,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-6 h-px bg-accent" />
          <span className="text-xs tracking-widest uppercase text-accent font-medium">
            The process
          </span>
          <div className="w-6 h-px bg-accent" />
        </div>

        <h2 className="text-3xl md:text-4xl font-light text-center text-foreground tracking-tight">
          Get the project first.{" "}
          <span className="font-medium">Then pick your cabinetmaker.</span>
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-border border border-border">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-background p-10">
              {/* Step number watermark */}
              <span
                className="absolute top-4 right-5 text-6xl font-bold text-accent opacity-[0.07] leading-none select-none"
                aria-hidden="true"
              >
                {i + 1}
              </span>

              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                <step.icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>

              <div className="text-xs font-medium text-muted-foreground tracking-widest uppercase mb-2">
                Step {i + 1}
              </div>

              <h3 className="text-lg font-medium text-foreground mb-3 leading-snug">
                {step.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {step.description}
              </p>

              {step.detail && (
                <p className="mt-4 text-xs text-accent font-normal tracking-wide">
                  {step.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}