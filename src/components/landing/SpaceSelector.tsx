import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, CuboidIcon, Calculator, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Size = "small" | "medium" | "large";

interface SpaceConfig {
  name: string;
  hint: string;
  prices: { small: number; medium: number | null; large: number | null };
}

const SPACES: SpaceConfig[] = [
  { name: "Kitchen", hint: "Most kitchens are 100–200 sq/ft", prices: { small: 350, medium: 550, large: 850 } },
  { name: "Living / Family Room", hint: "Most living rooms are 150–250 sq/ft", prices: { small: 300, medium: 500, large: 750 } },
  { name: "Closet", hint: "Most closets are 25–100 sq/ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Pantry", hint: "Most pantries are under 80 sq/ft", prices: { small: 200, medium: 350, large: null } },
  { name: "Bathroom", hint: "Most bathrooms are 40–100 sq/ft", prices: { small: 200, medium: 350, large: 500 } },
  { name: "Home Office", hint: "Most home offices are 80–150 sq/ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Bedroom", hint: "Most bedrooms are 100–200 sq/ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Mudroom", hint: "Most mudrooms are 40–100 sq/ft", prices: { small: 200, medium: 300, large: 450 } },
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

function sqftToSize(sqft: number): Size {
  if (sqft >= 160) return "large";
  if (sqft >= 80) return "medium";
  return "small";
}

export function SpaceSelector() {
  const [selectedSpaces, setSelectedSpaces] = useState<SelectedSpace[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const addSpace = (space: SpaceConfig, size: Size) => {
    const price = space.prices[size];
    if (price === null) return;
    setSelectedSpaces((prev) => [...prev, { name: space.name, size, price, render3d: false }]);
  };

  const removeSpace = (index: number) => {
    setSelectedSpaces((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRender = (index: number) => {
    setSelectedSpaces((prev) =>
      prev.map((s, i) => (i === index ? { ...s, render3d: !s.render3d } : s))
    );
  };

  const subtotal = selectedSpaces.reduce((sum, s) => sum + s.price + (s.render3d ? 150 : 0), 0);
  const discount = getDiscount(selectedSpaces.length);
  const total = subtotal * (1 - discount);

  return (
    <section id="space-selector" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          Select your spaces
        </h2>
        <p className="mt-3 text-center text-muted-foreground font-light">
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

          {/* Custom Space card */}
          <div className="border border-border rounded-lg p-5 hover:border-accent/30 transition-colors flex flex-col">
            <h4 className="font-medium text-foreground">Custom Space</h4>
            <p className="text-xs text-muted-foreground mt-1 flex-1">Don't see your space? Let us know.</p>
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Request quote
            </button>
          </div>
        </div>

        {showCustom && (
          <div className="mt-6 max-w-md mx-auto border border-border rounded-lg p-6">
            <h3 className="font-medium text-foreground">Custom Space Request</h3>
            <p className="mt-1 text-sm text-muted-foreground font-light">Tell us about your space and we'll send you a quote.</p>
            <div className="mt-4 space-y-3">
              <Input placeholder="Space name (e.g. Laundry Room)" />
              <Input placeholder="Your email" type="email" />
              <textarea
                placeholder="Describe the space and what you need..."
                rows={3}
                className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <Button variant="hero" className="w-full">Send request</Button>
            </div>
          </div>
        )}

        {selectedSpaces.length > 0 && (
          <div className="mt-12 border border-border rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-foreground">Your project</h3>
            <div className="mt-4 space-y-3">
              {selectedSpaces.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="text-muted-foreground text-sm ml-2 font-light">{SIZE_LABELS[s.size]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRender(i)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        s.render3d
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
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
                  <span className="text-success font-medium">-${(subtotal * discount).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium text-foreground">
                <span>Total</span>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <Input
                placeholder="Your name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Input
                placeholder="Your email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>

            <p className="text-[10px] text-muted-foreground font-light mt-4 leading-relaxed">
              Projects are based on client-provided measurements. An on-site measurement visit by your cabinetmaker prior to fabrication is always recommended.
            </p>

            <Button
              variant="hero"
              className="w-full mt-4"
              disabled={checkoutLoading || !clientName.trim() || !clientEmail.trim()}
              onClick={async () => {
                setCheckoutLoading(true);
                try {
                  const { data, error } = await supabase.functions.invoke("create-checkout", {
                    body: {
                      spaces: selectedSpaces.map((s) => ({
                        name: s.name,
                        size: s.size,
                        price: s.price,
                        render3d: s.render3d,
                      })),
                      clientName: clientName.trim(),
                      clientEmail: clientEmail.trim(),
                      originUrl: window.location.origin,
                    },
                  });
                  if (error) throw error;
                  if (data?.url) {
                    window.open(data.url, '_blank') || (window.location.href = data.url);
                  } else {
                    throw new Error("No checkout URL returned");
                  }
                } catch (err: any) {
                  console.error(err);
                  toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
                  setCheckoutLoading(false);
                }
              }}
            >
              {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {checkoutLoading ? "Redirecting…" : "Proceed to checkout"}
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
  const [showCalc, setShowCalc] = useState(false);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const calculatedSqft = length && width ? parseFloat(length) * parseFloat(width) : null;

  const handleCalcApply = () => {
    if (calculatedSqft !== null && calculatedSqft > 0) {
      const size = sqftToSize(calculatedSqft);
      if (space.prices[size] !== null) setSelectedSize(size);
    }
  };

  const currentPrice = space.prices[selectedSize];

  return (
    <div className="border border-border rounded-lg p-5 hover:border-accent/30 transition-colors relative">
      {selectedCount > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
          {selectedCount}
        </div>
      )}
      <h4 className="font-medium text-foreground">{space.name}</h4>
      <p className="text-xs text-muted-foreground mt-1 font-light">{space.hint}</p>

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
                  ? "bg-accent/10 text-accent font-medium"
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
        onClick={() => setShowCalc(!showCalc)}
        className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
      >
        <Calculator className="w-3.5 h-3.5" />
        {showCalc ? "Hide calculator" : "Help me calculate"}
      </button>

      {showCalc && (
        <div className="mt-2 p-3 bg-secondary rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-muted-foreground">Length (ft)</label>
              <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="h-8 text-sm" min="0" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Width (ft)</label>
              <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="h-8 text-sm" min="0" />
            </div>
          </div>
          {calculatedSqft !== null && calculatedSqft > 0 && (
            <div className="text-xs text-foreground font-medium pt-1">
              {calculatedSqft.toFixed(0)} sq/ft → {SIZE_LABELS[sqftToSize(calculatedSqft)]}
            </div>
          )}
          <button
            onClick={handleCalcApply}
            disabled={!calculatedSqft || calculatedSqft <= 0}
            className="w-full text-xs font-medium text-accent hover:text-accent/80 disabled:opacity-40 disabled:cursor-not-allowed pt-1"
          >
            Apply size
          </button>
        </div>
      )}

      <button
        onClick={() => currentPrice !== null && onAdd(space, selectedSize)}
        disabled={currentPrice === null}
        className="mt-4 w-full flex items-center justify-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors disabled:opacity-40"
      >
        <Plus className="w-4 h-4" />
        Add space
      </button>
    </div>
  );
}
