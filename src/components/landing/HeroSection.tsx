import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ROTATING_WORDS = ["kitchen", "closet", "office", "pantry", "bathroom"];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const timeout = setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 400);
      return () => clearTimeout(timeout);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-start px-6 overflow-hidden pt-28">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(218 45% 20% / 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(218 45% 20% / 0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent vertical lines */}
      <div className="absolute top-0 left-0 w-px h-40 bg-gradient-to-b from-transparent via-accent to-transparent opacity-40" />
      <div className="absolute bottom-0 right-0 w-px h-40 bg-gradient-to-t from-transparent via-accent to-transparent opacity-40" />

      <div className="relative max-w-4xl mx-auto text-center">

        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-8 h-px bg-accent" />
          <span className="text-xs tracking-widest uppercase text-accent font-medium">
            Professional cabinetry design
          </span>
          <div className="w-8 h-px bg-accent" />
        </div>

        {/* Headline */}
        <h1
          className="font-extralight text-foreground leading-tight"
          style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)", letterSpacing: "-0.02em" }}
        >
          Your{" "}
          <span
            className="text-accent font-light"
            style={{
              display: "inline-block",
              minWidth: "5ch",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-6px)",
            }}
          >
            {ROTATING_WORDS[wordIndex]}
          </span>
          ,<br />
          your terms.{" "}
          <span className="font-medium">You choose who builds it.</span>
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mt-10 mb-10">
          <div className="h-px w-16 bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Subheading */}
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light tracking-wide">
          Most people call a cabinetmaker and hope for the best. With Measured,
          you arrive with the project in hand — ready to compare quotes, ask the
          right questions, and{" "}
          <span className="text-foreground font-normal">decide on your terms.</span>
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Button
            variant="hero"
            onClick={() => scrollTo("space-selector")}
            className="min-w-[200px]"
          >
            Start your project
          </Button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
          >
            See how it works
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground tracking-widest uppercase">
          {[
            "First draft in 7 business days",
            "2 revision rounds",
            "Final delivery in 5 days after approval",
            "You own the project",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
