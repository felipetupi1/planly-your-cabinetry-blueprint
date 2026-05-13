import { useState, useRef, useEffect } from "react";
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
  { name: "Kitchen", hint: "Small: up to 10×10 ft · Medium: up to 12×15 ft · Large: over 15×15 ft", prices: { small: 350, medium: 550, large: 850 } },
  { name: "Closet", hint: "Small: reach-in or single wall · Medium: walk-in up to 8×10 ft · Large: over 8×10 ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Pantry", hint: "Small: cabinet pantry · Medium: walk-in up to 5×6 ft · Large: over 5×6 ft", prices: { small: 200, medium: 350, large: null } },
  { name: "Bathroom", hint: "Small: single vanity · Medium: double vanity · Large: full bath with custom storage", prices: { small: 200, medium: 350, large: 500 } },
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

  const leadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (leadTimerRef.current) clearTimeout(leadTimerRef.current);
    };
  }, []);

  const upsertLead = (nameVal: string, emailVal: string) => {
    if (leadTimerRef.current) clearTimeout(leadTimerRef.current);
    leadTimerRef.current = setTimeout(async () => {
      const email = emailVal.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      try {
        await supabase
          .from("leads")
          .upsert(
            {
              name: nameVal.trim() || null,
              email,
              spaces_selected: selectedSpaces as any,
            },
            { onConflict: "email" }
          );
      } catch (err) {
        console.error("Lead upsert failed", err);
      }
    }, 500);
  };

  const subtotal = selectedSpaces.reduce((sum, s) => sum + s.price + (s.render3d ? 150 : 0), 0);
  const discount = getDiscount(selectedSpaces.length);
  const total = subtotal * (1 - discount);

  const handleCheckout = async () => {
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
        window.open(data.url, "_blank") || (window.location.href = data.url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
      setCheckoutLoading(false);
    }
  };

  const scrollToSummary = () => {
    document.getElementById("order-summary-mobile")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Shared sidebar/summary content. `dark` = navy variant for desktop sidebar.
  const renderSummary = (dark: boolean) => {
    const baseText = dark ? "text-white" : "text-foreground";
    const subText = dark ? "text-white/60" : "text-muted-foreground";
    const divider = dark ? "border-white/10" : "border-border";
    const inputCls = dark
      ? "bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-white/30"
      : "";

    if (selectedSpaces.length === 0) {
      return (
        <div className={`${baseText}`}>
          <h3 className="text-lg font-medium tracking-wide">Your project</h3>
          <p className={`mt-2 text-sm font-light ${subText}`}>
            Select a space to start your order. Multi-space discounts apply automatically.
          </p>
        </div>
      );
    }

    return (
      <div className={baseText}>
        <h3 className="text-lg font-medium tracking-wide">Your project</h3>
        <div className={`mt-4 space-y-2 max-h-[40vh] lg:max-h-[45vh] overflow-y-auto pr-1`}>
          {selectedSpaces.map((s, i) => (
            <div key={i} className={`flex items-start justify-between gap-3 py-2 border-b ${divider} last:border-0`}>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{s.name}</div>
                <div className={`text-xs font-light ${subText}`}>{SIZE_LABELS[s.size]}</div>
                <button
                  onClick={() => toggleRender(i)}
                  className={`mt-1.5 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    s.render3d
                      ? "bg-accent text-accent-foreground border-accent"
                      : `${divider} ${subText} hover:border-accent hover:text-accent`
                  }`}
                >
                  <CuboidIcon className="w-3 h-3 inline mr-1" />
                  3D +$150
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm w-14 text-right">
                  ${s.price + (s.render3d ? 150 : 0)}
                </span>
                <button
                  onClick={() => removeSpace(i)}
                  className={`${subText} hover:text-destructive`}
                  aria-label="Remove"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-4 pt-4 border-t ${divider} space-y-1`}>
          {discount > 0 && (
            <div className="flex justify-between text-xs">
              <span className={dark ? "text-accent" : "text-success font-medium"}>
                Multi-space discount ({Math.round(discount * 100)}% off)
              </span>
              <span className={dark ? "text-accent" : "text-success font-medium"}>
                -${(subtotal * discount).toFixed(0)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span>${total.toFixed(0)}</span>
          </div>
        </div>

        <div className={`mt-4 pt-4 border-t ${divider} space-y-2`}>
          <Input
            placeholder="Your name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            onBlur={(e) => upsertLead(e.target.value, clientEmail)}
            className={inputCls}
          />
          <Input
            placeholder="Your email"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            onBlur={(e) => upsertLead(clientName, e.target.value)}
            className={inputCls}
          />
        </div>

        <p className={`text-[10px] font-light mt-3 leading-relaxed ${subText}`}>
          Projects are based on client-provided measurements. An on-site measurement visit by your cabinetmaker prior to fabrication is always recommended.
        </p>

        <Button
          variant="hero"
          className="w-full mt-3"
          disabled={checkoutLoading || !clientName.trim() || !clientEmail.trim()}
          onClick={handleCheckout}
        >
          {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {checkoutLoading ? "Redirecting…" : "Proceed to checkout"}
        </Button>
      </div>
    );
  };

  return (
    <section id="space-selector" className="py-24 px-6 pb-32 lg:pb-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          Custom Cabinetry Design Pricing — Choose Your Space
        </h2>
        <p className="mt-3 text-center text-muted-foreground font-light">
          Choose your rooms and sizes. Multi-space discounts apply automatically.
        </p>

        <div className="mt-12 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:items-start">
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            {/* Mobile/tablet inline summary */}
            <div id="order-summary-mobile" className="lg:hidden mt-10">
              {selectedSpaces.length > 0 && (
                <div className="border border-border rounded-lg p-6">
                  {renderSummary(false)}
                </div>
              )}
            </div>
          </div>

          {/* Desktop sticky sidebar */}
          <aside className="hidden lg:block sticky top-24">
            <div className="rounded-lg p-6" style={{ backgroundColor: "#1a2332" }}>
              {renderSummary(true)}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      {selectedSpaces.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 border-t border-white/10" style={{ backgroundColor: "#1a2332" }}>
          <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
            <div className="text-white">
              <div className="text-[10px] uppercase tracking-[2px] text-white/60">Total</div>
              <div className="text-lg font-medium leading-tight">${total.toFixed(0)}</div>
            </div>
            <Button variant="hero" onClick={scrollToSummary} className="flex-1 max-w-[220px]">
              Checkout
            </Button>
          </div>
        </div>
      )}
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
