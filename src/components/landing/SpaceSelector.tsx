import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Plus, Minus, CuboidIcon } from "lucide-react";

type Size = "small" | "medium" | "large";

interface SpaceConfig {
  name: string;
  hint: string;
  prices: { small: number; medium: number | null; large: number | null };
}

const SPACES: SpaceConfig[] = [
  { name: "Kitchen", hint: "Typical: 100–200 sq/ft", prices: { small: 350, medium: 550, large: 850 } },
  { name: "Living / Family Room", hint: "Typical: 200–400 sq/ft", prices: { small: 300, medium: 500, large: 750 } },
  { name: "Closet", hint: "Walk-in: 25–100 sq/ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Pantry", hint: "Typical: 20–60 sq/ft", prices: { small: 200, medium: 350, large: null } },
  { name: "Vanity / Bathroom", hint: "Typical: 35–100 sq/ft", prices: { small: 200, medium: 350, large: 500 } },
  { name: "Home Office", hint: "Typical: 50–150 sq/ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Bedroom", hint: "Typical: 120–200 sq/ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Mudroom", hint: "Typical: 30–70 sq/ft", prices: { small: 200, medium: 300, large: 450 } },
];

const SIZE_LABELS: Record<Size, string> = {
  small: "Small (under 80 sq/ft)",
  medium: "Medium (80–160 sq/ft)",
  large: "Large (over 160 sq/ft)",
};

interface SelectedSpace {
  name: string;
  size: Size;
  price: number;
  render3d: boolean;
}

function getDiscount(count: number): number {
  if (count >= 4) return 0.2;
  if (count >= 3) return 0.15;
  if (count >= 2) return 0.1;
  return 0;
}

export function SpaceSelector() {
  const [selectedSpaces, setSelectedSpaces] = useState<SelectedSpace[]>([]);

  const addSpace = (space: SpaceConfig, size: Size) => {
    const price = space.prices[size];
    if (price === null) return;
    setSelectedSpaces((prev) => [
      ...prev,
      { name: space.name, size, price, render3d: false },
    ]);
  };

  const removeSpace = (index: number) => {
    setSelectedSpaces((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRender = (index: number) => {
    setSelectedSpaces((prev) =>
      prev.map((s, i) => (i === index ? { ...s, render3d: !s.render3d } : s))
    );
  };

  const subtotal = selectedSpaces.reduce(
    (sum, s) => sum + s.price + (s.render3d ? 150 : 0),
    0
  );
  const discount = getDiscount(selectedSpaces.length);
  const total = subtotal * (1 - discount);

  return (
    <section id="space-selector" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground">
          Select your spaces
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Choose your rooms and sizes. Multi-space discounts apply automatically.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPACES.map((space) => (
            <SpaceCard
              key={space.name}
              space={space}
              onAdd={addSpace}
              selectedCount={selectedSpaces.filter((s) => s.name === space.name).length}
            />
          ))}
        </div>

        {selectedSpaces.length > 0 && (
          <div className="mt-12 border border-border rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="font-heading text-xl font-semibold text-foreground">Your project</h3>
            <div className="mt-4 space-y-3">
              {selectedSpaces.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      {SIZE_LABELS[s.size]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRender(i)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        s.render3d
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      <CuboidIcon className="w-3 h-3 inline mr-1" />
                      3D +$150
                    </button>
                    <span className="text-foreground font-medium w-16 text-right">
                      ${s.price + (s.render3d ? 150 : 0)}
                    </span>
                    <button onClick={() => removeSpace(i)} className="text-muted-foreground hover:text-destructive">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-1">
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success font-medium">
                    Multi-space discount ({Math.round(discount * 100)}% off)
                  </span>
                  <span className="text-success font-medium">
                    -${(subtotal * discount).toFixed(0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>

            <Button variant="hero" className="w-full mt-6">
              Proceed to checkout
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function SpaceCard({
  space,
  onAdd,
  selectedCount,
}: {
  space: SpaceConfig;
  onAdd: (space: SpaceConfig, size: Size) => void;
  selectedCount: number;
}) {
  const [selectedSize, setSelectedSize] = useState<Size>("medium");

  const currentPrice = space.prices[selectedSize];

  return (
    <div className="border border-border rounded-xl p-5 hover:border-primary/30 transition-colors relative">
      {selectedCount > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
          {selectedCount}
        </div>
      )}
      <h4 className="font-heading font-semibold text-foreground">{space.name}</h4>
      <p className="text-xs text-muted-foreground mt-1">{space.hint}</p>

      <div className="mt-4 space-y-1.5">
        {(["small", "medium", "large"] as Size[]).map((size) => {
          const price = space.prices[size];
          if (price === null) return null;
          return (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg flex justify-between transition-colors ${
                selectedSize === size
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <span className="capitalize">{size}</span>
              <span>${price}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => currentPrice !== null && onAdd(space, selectedSize)}
        disabled={currentPrice === null}
        className="mt-4 w-full flex items-center justify-center gap-1 text-sm font-medium text-primary hover:text-navy-light transition-colors disabled:opacity-40"
      >
        <Plus className="w-4 h-4" />
        Add space
      </button>
    </div>
  );
}
