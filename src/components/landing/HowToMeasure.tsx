const ACCENT = "hsl(var(--accent))";
const BORDER = "hsl(var(--border))";
const MUTED = "hsl(var(--muted-foreground))";
const FG = "hsl(var(--foreground))";
const SECONDARY = "hsl(var(--secondary))";

function FloorAreaDiagram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-40">
      {/* room */}
      <rect x="40" y="30" width="160" height="100" fill={SECONDARY} stroke={FG} strokeWidth="1.5" />
      {/* width arrow (top) */}
      <line x1="40" y1="18" x2="200" y2="18" stroke={ACCENT} strokeWidth="1.5" />
      <polygon points="40,18 46,15 46,21" fill={ACCENT} />
      <polygon points="200,18 194,15 194,21" fill={ACCENT} />
      <text x="120" y="13" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="500">width</text>
      {/* length arrow (right) */}
      <line x1="212" y1="30" x2="212" y2="130" stroke={ACCENT} strokeWidth="1.5" />
      <polygon points="212,30 209,36 215,36" fill={ACCENT} />
      <polygon points="212,130 209,124 215,124" fill={ACCENT} />
      <text x="222" y="83" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="500" transform="rotate(90 222 83)">length</text>
      {/* center text */}
      <text x="120" y="78" textAnchor="middle" fontSize="9" fill={MUTED}>measure at</text>
      <text x="120" y="90" textAnchor="middle" fontSize="9" fill={MUTED}>floor level</text>
      {/* two measurement points */}
      <circle cx="70" cy="50" r="3" fill={ACCENT} />
      <circle cx="170" cy="110" r="3" fill={ACCENT} />
      <line x1="70" y1="50" x2="170" y2="110" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" />
      <text x="120" y="118" textAnchor="middle" fontSize="8" fill={MUTED} fontStyle="italic">measure in 2 spots</text>
    </svg>
  );
}

function CeilingHeightDiagram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-40">
      {/* ceiling band */}
      <rect x="20" y="20" width="200" height="10" fill={FG} />
      {/* floor band */}
      <rect x="20" y="130" width="200" height="10" fill={FG} />
      {/* soffit */}
      <rect x="140" y="30" width="60" height="22" fill={SECONDARY} stroke={FG} strokeWidth="1" />
      <text x="170" y="44" textAnchor="middle" fontSize="8" fill={MUTED}>soffit</text>
      {/* full height arrow (left) */}
      <line x1="55" y1="30" x2="55" y2="130" stroke={ACCENT} strokeWidth="1.5" />
      <polygon points="55,30 52,36 58,36" fill={ACCENT} />
      <polygon points="55,130 52,124 58,124" fill={ACCENT} />
      <text x="67" y="83" fontSize="9" fill={ACCENT} fontWeight="500">full height</text>
      {/* height-to-soffit arrow (right, under soffit) */}
      <line x1="170" y1="52" x2="170" y2="130" stroke={ACCENT} strokeWidth="1.5" />
      <polygon points="170,52 167,58 173,58" fill={ACCENT} />
      <polygon points="170,130 167,124 173,124" fill={ACCENT} />
      <text x="178" y="94" fontSize="9" fill={ACCENT} fontWeight="500">height to soffit</text>
      {/* labels */}
      <text x="120" y="16" textAnchor="middle" fontSize="9" fill={MUTED}>finished ceiling</text>
      <text x="120" y="153" textAnchor="middle" fontSize="9" fill={MUTED} fontStyle="italic">measure both if present</text>
    </svg>
  );
}

function DoorsWindowsDiagram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-40">
      {/* wall baseline */}
      <line x1="15" y1="135" x2="225" y2="135" stroke={FG} strokeWidth="1.5" />
      {/* door */}
      <rect x="40" y="50" width="50" height="85" fill="hsl(0 0% 100%)" stroke={FG} strokeWidth="1.5" />
      <line x1="40" y1="42" x2="90" y2="42" stroke={ACCENT} strokeWidth="1.5" />
      <polygon points="40,42 46,39 46,45" fill={ACCENT} />
      <polygon points="90,42 84,39 84,45" fill={ACCENT} />
      <text x="65" y="35" textAnchor="middle" fontSize="8" fill={ACCENT}>trim to trim</text>
      <text x="65" y="95" textAnchor="middle" fontSize="8" fill={MUTED}>door</text>
      {/* window */}
      <rect x="140" y="60" width="65" height="45" fill="hsl(210 80% 92%)" stroke={FG} strokeWidth="1.5" />
      <line x1="140" y1="52" x2="205" y2="52" stroke={ACCENT} strokeWidth="1.5" />
      <polygon points="140,52 146,49 146,55" fill={ACCENT} />
      <polygon points="205,52 199,49 199,55" fill={ACCENT} />
      <text x="172" y="45" textAnchor="middle" fontSize="8" fill={ACCENT}>trim to trim</text>
      {/* sill height */}
      <line x1="215" y1="105" x2="215" y2="135" stroke="hsl(210 70% 45%)" strokeWidth="1.5" />
      <polygon points="215,105 212,111 218,111" fill="hsl(210 70% 45%)" />
      <polygon points="215,135 212,129 218,129" fill="hsl(210 70% 45%)" />
      <text x="223" y="123" fontSize="8" fill="hsl(210 70% 45%)">sill ht</text>
    </svg>
  );
}

function ObstaclesDiagram() {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-40">
      {/* wall (top view) */}
      <rect x="20" y="30" width="200" height="14" fill={FG} />
      {/* baseboard band */}
      <rect x="20" y="44" width="200" height="6" fill={ACCENT} opacity="0.4" />
      <line x1="230" y1="30" x2="230" y2="50" stroke={ACCENT} strokeWidth="1.2" />
      <polygon points="230,30 227,36 233,36" fill={ACCENT} />
      <polygon points="230,50 227,44 233,44" fill={ACCENT} />
      <text x="225" y="65" textAnchor="end" fontSize="7" fill={ACCENT}>baseboard ht</text>

      {/* radiator */}
      <g transform="translate(45,80)">
        <rect width="32" height="22" fill="none" stroke={FG} strokeWidth="1.2" />
        <line x1="8" y1="0" x2="8" y2="22" stroke={FG} strokeWidth="1" />
        <line x1="16" y1="0" x2="16" y2="22" stroke={FG} strokeWidth="1" />
        <line x1="24" y1="0" x2="24" y2="22" stroke={FG} strokeWidth="1" />
        <line x1="16" y1="22" x2="16" y2="44" stroke={MUTED} strokeWidth="1" strokeDasharray="2 2" />
        <text x="16" y="56" textAnchor="middle" fontSize="8" fill={MUTED}>radiator</text>
      </g>

      {/* vent */}
      <g transform="translate(105,82)">
        <rect width="30" height="18" fill="none" stroke={FG} strokeWidth="1.2" />
        <line x1="0" y1="6" x2="30" y2="6" stroke={FG} strokeWidth="1" />
        <line x1="0" y1="12" x2="30" y2="12" stroke={FG} strokeWidth="1" />
        <line x1="15" y1="18" x2="15" y2="42" stroke={MUTED} strokeWidth="1" strokeDasharray="2 2" />
        <text x="15" y="54" textAnchor="middle" fontSize="8" fill={MUTED}>vent</text>
      </g>

      {/* pipe */}
      <g transform="translate(170,80)">
        <circle cx="12" cy="12" r="10" fill="none" stroke={FG} strokeWidth="1.2" />
        <circle cx="12" cy="12" r="4" fill={SECONDARY} stroke={FG} strokeWidth="1" />
        <line x1="12" y1="22" x2="12" y2="44" stroke={MUTED} strokeWidth="1" strokeDasharray="2 2" />
        <text x="12" y="56" textAnchor="middle" fontSize="8" fill={MUTED}>pipe</text>
      </g>
    </svg>
  );
}

const diagrams = [
  {
    label: "Floor area — length × width",
    Diagram: FloorAreaDiagram,
    tip: "Walls are rarely perfectly square. Measure in two spots and use the larger value.",
  },
  {
    label: "Ceiling height",
    Diagram: CeilingHeightDiagram,
    tip: "Measure from finished floor to finished ceiling — not to any beam, soffit, or HVAC duct.",
  },
  {
    label: "Doors & windows",
    Diagram: DoorsWindowsDiagram,
    tip: "Doors: measure trim-to-trim, including frame. Note which way it swings. Windows: measure trim-to-trim + sill height from floor.",
  },
  {
    label: "Obstacles & clearances",
    Diagram: ObstaclesDiagram,
    tip: "Note the height and depth of baseboards — cabinets need to clear them. Mark any pipe or vent locations on your sketch.",
  },
];

export function HowToMeasure() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-6 h-px bg-accent" />
          <span className="text-xs tracking-widest uppercase text-accent font-medium">
            Before you start
          </span>
          <div className="w-6 h-px bg-accent" />
        </div>

        <h2 className="text-3xl md:text-4xl font-light text-center text-foreground tracking-tight">
          How to measure your space
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Approximate measurements are a good start — no need to be precise to the millimeter.
        </p>

        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {diagrams.map(({ label, Diagram, tip }, i) => (
            <div key={i} className="bg-background border border-border rounded-sm p-6 flex flex-col">
              <h3 className="font-medium text-foreground tracking-widest text-[11px] uppercase">{label}</h3>
              <div className="mt-4 flex-1 flex items-center justify-center">
                <Diagram />
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed font-light">
                {tip}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground font-light italic text-center">
          Don't worry about being perfectly precise — your cabinetmaker will conduct a final on-site measurement before fabrication.
        </p>
      </div>
    </section>
  );
}
