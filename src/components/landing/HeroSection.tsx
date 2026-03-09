import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-foreground leading-tight">
          Your space, measured.
          <br />
          <span className="text-accent font-medium">Ready to build.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
          Get a professional cabinetry project online — so you can get accurate quotes
          and negotiate with any cabinetmaker. No surprises.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" onClick={() => scrollTo("space-selector")}>
            Start your project
          </Button>
          <button
            onClick={() => scrollTo("portfolio")}
            className="text-sm text-muted-foreground hover:text-accent transition-colors tracking-wide underline underline-offset-4"
          >
            See our work
          </button>
        </div>
      </div>
    </section>
  );
}
