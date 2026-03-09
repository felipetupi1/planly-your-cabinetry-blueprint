import { useState } from "react";
import { X } from "lucide-react";
import renderKitchen from "@/assets/portfolio/render-kitchen.jpg";
import renderCloset from "@/assets/portfolio/render-closet.jpg";
import docKitchen from "@/assets/portfolio/doc-kitchen.jpg";

const samples = [
  { src: renderKitchen, label: "Kitchen", type: "3D Render" },
  { src: renderCloset, label: "Closet", type: "3D Render" },
  { src: docKitchen, label: "Kitchen", type: "Construction Document" },
];

export function ProjectSamples() {
  const [lightbox, setLightbox] = useState<typeof samples[0] | null>(null);

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {samples.map((sample, i) => (
            <button
              key={i}
              onClick={() => setLightbox(sample)}
              className="group text-left rounded-lg overflow-hidden border border-border hover:border-accent/30 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={sample.src}
                  alt={`${sample.label} ${sample.type}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-foreground tracking-wide">
                  {sample.label}
                </span>
                <span className="text-xs text-muted-foreground">{sample.type}</span>
              </div>
            </button>
          ))}
        </div>
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
            <img src={lightbox.src} alt={lightbox.label} className="w-full rounded-lg" />
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-background/20 text-background">
                {lightbox.label}
              </span>
              <span className="text-sm text-background/70">{lightbox.type}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
