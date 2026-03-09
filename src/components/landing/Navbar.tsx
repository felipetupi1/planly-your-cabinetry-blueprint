import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const links = [
    { label: "How it works", id: "how-it-works" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Reviews", id: "reviews" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-[22px] font-bold text-foreground tracking-[4px] uppercase font-sans">
          MEASURED
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            >
              {link.label}
            </button>
          ))}
          <Button variant="navyCta" size="sm" onClick={() => scrollTo("space-selector")}>
            Start your project
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block text-sm text-muted-foreground hover:text-foreground tracking-wide"
            >
              {link.label}
            </button>
          ))}
          <Button variant="navyCta" size="sm" className="w-full" onClick={() => scrollTo("space-selector")}>
            Start your project
          </Button>
        </div>
      )}
    </nav>
  );
}
