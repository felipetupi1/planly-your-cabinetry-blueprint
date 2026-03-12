import felipePhoto from "@/assets/felipe.jpg";

export function FounderSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <div className="w-8 h-px bg-accent" />
          <span className="text-xs tracking-widest uppercase text-accent font-medium">
            Who's behind Measured
          </span>
          <div className="w-8 h-px bg-accent" />
        </div>

        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Photo */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl border border-accent/10" />
            <img
              src={felipePhoto}
              alt="Felipe — Founder of Measured"
              className="relative rounded-xl w-full object-cover object-top"
              style={{ maxHeight: "520px" }}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <h2
              className="font-light text-foreground leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Built by someone who has been on both sides of the table.
            </h2>

            <div className="w-10 h-px bg-accent" />

            <p className="text-muted-foreground leading-relaxed font-light">
              I'm Felipe — architect and cabinetry shop owner with over 20 years
              of hands-on experience in residential projects. I've designed the
              spaces. I've run the shop. I know exactly where communication breaks
              down between homeowners and cabinetmakers.
            </p>

            <p className="text-muted-foreground leading-relaxed font-light">
              Measured exists because I've seen that breakdown too many times.
              A client who didn't know what to ask. A cabinetmaker working from
              a napkin sketch. A result that satisfied no one.
            </p>

            <p className="text-foreground leading-relaxed font-light">
              Every project that comes through Measured is reviewed by someone
              who has actually built what you're planning — not by software,
              not by a generalist. By a professional who understands
              what a cabinetmaker needs to do their best work.
            </p>

            {/* Signature area */}
            <div className="mt-2 flex items-center gap-4">
              <div>
                <p className="text-foreground font-medium tracking-wide">Felipe</p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                  Architect · Founder, Measured
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}