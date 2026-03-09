import { Button } from "@/components/ui/button";

export function Navbar() {
  const scrollToSelector = () => {
    document.getElementById("space-selector")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-heading text-xl font-bold text-foreground tracking-tight">
          Measured
        </span>
        <Button variant="navyCta" size="sm" onClick={scrollToSelector}>
          Start your project
        </Button>
      </div>
    </nav>
  );
}
