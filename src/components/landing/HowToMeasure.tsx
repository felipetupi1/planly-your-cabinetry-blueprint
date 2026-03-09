import { Ruler, ArrowUpDown, DoorOpen, Square, Layers, AlertTriangle, Lightbulb, Scan } from "lucide-react";

const steps = [
  {
    icon: Ruler,
    title: "Room width and length",
    description: "Measure at floor level, wall to wall.",
  },
  {
    icon: ArrowUpDown,
    title: "Ceiling height",
    description: "From floor to ceiling — essential for full-height cabinetry.",
  },
  {
    icon: DoorOpen,
    title: "Door openings",
    description: "Width and height, trim to trim. Note swing direction.",
  },
  {
    icon: Square,
    title: "Window openings",
    description: "Width, height, and sill height from floor — trim to trim.",
  },
  {
    icon: Layers,
    title: "Baseboard height",
    description: "Note baseboard height along all walls.",
  },
  {
    icon: AlertTriangle,
    title: "Obstacles",
    description: "Vents, radiators, electrical panels, pipes — anything that protrudes from a wall.",
  },
];

export function HowToMeasure() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          How to measure your space
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto font-light">
          Follow these steps so we can design your cabinetry with precision.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="border border-border rounded-lg p-5 bg-background">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-medium text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed font-light">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="flex-1 flex items-start gap-3 border border-border rounded-lg p-5 bg-background">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              <span className="font-medium text-foreground">Tip:</span> A simple sketch with dimensions is enough — it doesn't need to be perfect.
            </p>
          </div>
          <div className="flex-1 flex items-start gap-3 border border-border rounded-lg p-5 bg-background">
            <Scan className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              Not sure? You can <span className="font-medium text-foreground">scan your space in 3D</span> directly from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
