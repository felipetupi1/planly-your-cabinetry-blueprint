import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { portfolioItems, type PortfolioItem } from "@/data/portfolioData";

export function Portfolio() {
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  const renders = portfolioItems.filter((i) => i.category === "render");
  const docs = portfolioItems.filter((i) => i.category === "document");

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          What your project looks like
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto font-light">
          From photorealistic 3D renders to construction-ready documents — see what you'll receive.
        </p>

        <Tabs defaultValue="renders" className="mt-12">
          <TabsList className="mx-auto flex w-fit">
            <TabsTrigger value="renders">Renders</TabsTrigger>
            <TabsTrigger value="documents">Construction Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="renders" className="mt-8">
            <PortfolioGrid items={renders} onSelect={setLightbox} />
          </TabsContent>

          <TabsContent value="documents" className="mt-8">
            <p className="text-sm text-muted-foreground mb-6 text-center font-light">
              Each project includes multiple sheets. Here's a sample from each space type.
            </p>
            <PortfolioGrid items={docs} onSelect={setLightbox} />
          </TabsContent>
        </Tabs>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-background hover:text-background/80">
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.spaceType} className="w-full rounded-lg" />
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-background/20 text-background">
                {lightbox.spaceType}
              </span>
              {lightbox.description && (
                <span className="text-sm text-background/70">{lightbox.description}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PortfolioGrid({
  items,
  onSelect,
}: {
  items: PortfolioItem[];
  onSelect: (item: PortfolioItem) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group text-left rounded-lg overflow-hidden border border-border hover:border-accent/30 transition-all"
        >
          <div className="aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={item.src}
              alt={item.spaceType}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-foreground tracking-wide">
              {item.spaceType}
            </span>
            {item.description && (
              <p className="mt-2 text-sm text-muted-foreground font-light">{item.description}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
