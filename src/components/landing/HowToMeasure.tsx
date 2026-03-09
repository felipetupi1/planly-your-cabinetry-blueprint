import { Ruler, ArrowUpDown, DoorOpen, Square, Layers, AlertTriangle, PenLine, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Ruler,
    title: "Measure room length and width",
    description: "Measure the length and width of the room at floor level, wall to wall.",
  },
  {
    icon: ArrowUpDown,
    title: "Measure ceiling height",
    description: "Measure from floor to ceiling. Essential for cabinetry that goes to the ceiling.",
  },
  {
    icon: DoorOpen,
    title: "Measure door openings",
    description: "Note width, height, and which way each door swings.",
  },
  {
    icon: Square,
    title: "Measure window openings",
    description: "Note width, height, and distance from floor to bottom of the window.",
  },
  {
    icon: Layers,
    title: "Note trim and baseboard depth",
    description: "Measure the depth of door and window trim (casing) on all sides, and note baseboard height along all walls.",
  },
  {
    icon: AlertTriangle,
    title: "Mark obstacles",
    description: "Note any radiators, vents, electrical panels, pipes, or anything that protrudes from a wall.",
  },
];

export function HowToMeasure() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground">
          How to measure your space
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Follow these steps so we can design your cabinetry with precision.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="border border-border rounded-xl p-5 bg-background"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 max-w-xl mx-auto border border-border rounded-xl p-5 bg-background">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tip:</span> A simple sketch with dimensions is enough — it doesn't need to be perfect. We'll create the professional floor plan for you.
          </p>
        </div>
      </div>
    </section>
  );
}
