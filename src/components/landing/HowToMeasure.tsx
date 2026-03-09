const tips = [
  {
    title: "Room dimensions",
    text: "Measure width and length at floor level, not at ceiling height. Walls are rarely perfectly square, so measure in two spots if possible.",
  },
  {
    title: "Ceiling height",
    text: "Essential if you want cabinetry that reaches the ceiling. Measure from finished floor to finished ceiling, not to any beam or soffit.",
  },
  {
    title: "Doors — think trim, not opening",
    text: "Measure the full width and height from trim to trim, not just the opening. Note which way the door swings — it affects cabinet placement.",
  },
  {
    title: "Windows — sill matters",
    text: "Measure width and height trim to trim. Also note the sill height from the floor — this determines how high base cabinets can go on that wall.",
  },
  {
    title: "Baseboards — they take up space",
    text: "Note the height and depth of your baseboards. Cabinets need to clear them or sit on top of them.",
  },
  {
    title: "Obstacles worth noting",
    text: "Radiators, vents, electrical panels, exposed pipes. Even a rough location on a sketch helps us work around them.",
  },
];

export function HowToMeasure() {
  return (
    <section className="py-24 px-6 bg-warm-gray">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          Before you start — what to measure
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto font-light">
          You don't need to be precise to the millimeter. But the more accurate your measurements, the better your project will turn out.
        </p>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {tips.map((tip, i) => (
            <div key={i} className="bg-background rounded-lg p-6">
              <h3 className="font-medium text-foreground tracking-wide">{tip.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light">
                {tip.text}
              </p>
            </div>
          ))}

          {/* CTA tip — styled differently */}
          <div className="md:col-span-2 bg-background rounded-lg p-6">
            <h3 className="text-lg font-medium text-accent tracking-wide">When in doubt, scan</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed font-light">
              Not sure about any of this? You can scan your space in 3D directly from your dashboard — no measuring tape needed.
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-foreground font-light italic text-center">
          Don't worry about being perfectly precise — your cabinetmaker will conduct a final on-site measurement before fabrication.
        </p>
      </div>
    </section>
  );
}
