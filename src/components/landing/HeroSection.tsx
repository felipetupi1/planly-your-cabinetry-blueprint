import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToSelector = () => {
    document.getElementById("space-selector")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
          Your space, planned.
          <br />
          <span className="text-primary">Ready to build.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get a professional cabinetry project online — so you can get accurate quotes and negotiate with any cabinetmaker. No surprises.
        </p>
        <Button variant="hero" className="mt-10" onClick={scrollToSelector}>
          Start your project
        </Button>
      </div>
    </section>
  );
}
