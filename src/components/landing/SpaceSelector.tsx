import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, CuboidIcon, Calculator, MessageSquare, Loader2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Size = "small" | "medium" | "large";

interface SpaceConfig {
  name: string;
  hint: string;
  prices: { small: number; medium: number | null; large: number | null };
}

const SPACES: SpaceConfig[] = [
  { name: "Kitchen", hint: "Small: up to 100 sq ft · Medium: 100–200 sq ft · Large: over 200 sq ft", prices: { small: 350, medium: 550, large: 850 } },
  { name: "Closet", hint: "Small: up to 30 sq ft · Medium: 30–60 sq ft · Large: over 60 sq ft", prices: { small: 250, medium: 400, large: 600 } },
  { name: "Pantry", hint: "Small: up to 25 sq ft · Medium: 25–50 sq ft · Large: over 50 sq ft", prices: { small: 200, medium: 350, large: null } },
  { name: "Bathroom", hint: "Small: up to 50 sq ft · Medium: 50–100 sq ft · Large: over 100 sq ft", prices: { small: 200, medium: 350, large: 500 } },
  { name: "Mudroom", hint: "Most mudrooms are 40–100 sq/ft", prices: { small: 200, medium: 300, large: 450 } },
];

const SIZE_LABELS: Record<Size, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

// Per-space sq ft ranges + numeric bounds for the calculator.
type SizeRange = {
  small: string;
  medium: string;
  large: string;
  smallMax: number;
  mediumMax: number;
};
const SIZE_RANGES: Record<string, SizeRange> = {
  Kitchen:  { small: "up to 100 sq ft", medium: "100–200 sq ft", large: "over 200 sq ft", smallMax: 100, mediumMax: 200 },
  Closet:   { small: "up to 30 sq ft",  medium: "30–60 sq ft",   large: "over 60 sq ft",  smallMax: 30,  mediumMax: 60  },
  Bathroom: { small: "up to 50 sq ft",  medium: "50–100 sq ft",  large: "over 100 sq ft", smallMax: 50,  mediumMax: 100 },
  Pantry:   { small: "up to 25 sq ft",  medium: "25–50 sq ft",   large: "over 50 sq ft",  smallMax: 25,  mediumMax: 50  },
};

// Average sq ft used to compute estimated total area per selected space.
const AVG_SQFT: Record<string, Record<Size, number>> = {
  Kitchen:  { small: 50, medium: 150, large: 250 },
  Closet:   { small: 15, medium: 45,  large: 80  },
  Bathroom: { small: 25, medium: 75,  large: 125 },
  Pantry:   { small: 12, medium: 37,  large: 65  },
};

const TERRACOTTA = "#D85A30";

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

function sqftToSizeFor(spaceName: string, sqft: number): Size {
  const r = SIZE_RANGES[spaceName];
  if (!r) {
    if (sqft >= 160) return "large";
    if (sqft >= 80) return "medium";
    return "small";
  }
  if (sqft <= r.smallMax) return "small";
  if (sqft <= r.mediumMax) return "medium";
  return "large";
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
        await supabase.from("leads").insert({
          name: nameVal.trim() || null,
          email,
          spaces_selected: selectedSpaces as any,
        });
      } catch (err) {
        // Expected on duplicate email; safe to ignore.
      }
    }, 500);
  };

  const subtotal = selectedSpaces.reduce((sum, s) => sum + s.price + (s.render3d ? 150 : 0), 0);
  const discount = getDiscount(selectedSpaces.length);
  const total = subtotal * (1 - discount);
  const totalSqft = selectedSpaces.reduce(
    (sum, s) => sum + (AVG_SQFT[s.name]?.[s.size] ?? 0),
    0
  );

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
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleRender(i)}
                        aria-pressed={s.render3d}
                        className={`mt-1.5 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          s.render3d
                            ? "border-transparent text-white"
                            : `${divider} ${subText} hover:border-[#b85c38] hover:text-[#b85c38]`
                        }`}
                        style={s.render3d ? { backgroundColor: "#b85c38" } : undefined}
                      >
                        {s.render3d ? <Check className="w-3 h-3" /> : <CuboidIcon className="w-3 h-3" />}
                        3D +$150
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add photorealistic 3D renders of your project</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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

        {totalSqft > 0 && (
          <div className={`mt-3 flex justify-between text-xs ${subText}`}>
            <span>Estimated total area</span>
            <span>~{totalSqft} sq ft</span>
          </div>
        )}

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
          className="w-full mt-3 text-white hover:opacity-90"
          style={{ backgroundColor: "#b85c38" }}
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

        <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPACES.map((space) => (
                <SpaceCard
                  key={space.name}
                  space={space}
                  onAdd={addSpace}
                  selectedCount={selectedSpaces.filter((s) => s.name === space.name).length}
                />
              ))}

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

            <div id="order-summary-mobile" className="lg:hidden mt-10">
              {selectedSpaces.length > 0 && (
                <div className="border border-border rounded-lg p-6">
                  {renderSummary(false)}
                </div>
              )}
            </div>
          </div>

          <aside className="hidden lg:block sticky top-24">
            <div className="rounded-lg p-6" style={{ backgroundColor: "#1a2332" }}>
              {renderSummary(true)}
            </div>
          </aside>
        </div>
      </div>

      {selectedSpaces.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 border-t border-white/10" style={{ backgroundColor: "#1a2332" }}>
          <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
            <div className="text-white">
              <div className="text-[10px] uppercase tracking-[2px] text-white/60">Total</div>
              <div className="text-lg font-medium leading-tight">
                ${total.toFixed(0)}
                {totalSqft > 0 && (
                  <span className="ml-2 text-xs font-light text-white/60">~{totalSqft} sq ft</span>
                )}
              </div>
            </div>
            <Button
              variant="hero"
              onClick={scrollToSummary}
              className="flex-1 max-w-[220px] text-white hover:opacity-90"
              style={{ backgroundColor: "#b85c38" }}
            >
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
  const [calcOpen, setCalcOpen] = useState(false);
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const pendingCalcSizeRef = useRef<Size | null>(null);

  const ranges = SIZE_RANGES[space.name];
  const calcSqft =
    width && length ? parseFloat(width) * parseFloat(length) : null;
  const calcSize =
    calcSqft !== null && calcSqft > 0
      ? sqftToSizeFor(space.name, calcSqft)
      : null;

  const handleCalcApply = () => {
    if (calcSize && space.prices[calcSize] !== null) {
      pendingCalcSizeRef.current = calcSize;
    }
    setCalcOpen(false);
  };

  useEffect(() => {
    if (!calcOpen && pendingCalcSizeRef.current) {
      setSelectedSize(pendingCalcSizeRef.current);
      pendingCalcSizeRef.current = null;
    }
  }, [calcOpen]);

  const currentPrice = space.prices[selectedSize];

  const sizeColors: Record<Size, string> = {
    small: "#16A34A",
    medium: TERRACOTTA,
    large: "#2563EB",
  };

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
          const rangeLabel = ranges?.[size];
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-[2px] flex items-center gap-1.5 transition-colors border ${
                isSelected
                  ? "border-transparent"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
              style={
                isSelected
                  ? { backgroundColor: `${TERRACOTTA}14`, color: TERRACOTTA }
                  : undefined
              }
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-[2px] text-[10px] font-semibold shrink-0"
                style={
                  isSelected
                    ? { backgroundColor: TERRACOTTA, color: "#fff" }
                    : { backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }
                }
              >
                {size.charAt(0).toUpperCase()}
              </span>
              <span className="font-medium capitalize shrink-0">{size}</span>
              {rangeLabel && (
                <span className="text-[10px] font-light opacity-80 whitespace-nowrap">
                  {rangeLabel}
                </span>
              )}
              <span className="ml-auto font-medium shrink-0">${price}</span>
            </button>
          );
        })}
      </div>

      {ranges && (
        <button
          onClick={() => setCalcOpen(true)}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          <Calculator className="w-3.5 h-3.5" />
          Help me calculate
        </button>
      )}

      <button
        onClick={() => currentPrice !== null && onAdd(space, selectedSize)}
        disabled={currentPrice === null}
        className="mt-4 w-full flex items-center justify-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors disabled:opacity-40"
      >
        <Plus className="w-4 h-4" />
        Add space
      </button>

      {ranges && (
        <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-medium tracking-wide">
                Help me calculate — {space.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Width (ft)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Length (ft)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {(["small", "medium", "large"] as Size[]).map((s) => {
                  const active = calcSize === s;
                  return (
                    <div
                      key={s}
                      className={`flex-1 text-center py-2 rounded-[2px] border text-xs font-medium transition-colors ${
                        active ? "border-transparent text-white" : "border-border text-muted-foreground"
                      }`}
                      style={active ? { backgroundColor: sizeColors[s] } : undefined}
                    >
                      <div className="text-base font-semibold leading-none">
                        {s.charAt(0).toUpperCase()}
                      </div>
                      <div className="capitalize mt-1">{s}</div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center py-3 border border-border rounded-[2px] bg-secondary/40">
                {calcSqft !== null && calcSqft > 0 ? (
                  <>
                    <div className="text-2xl font-semibold text-foreground">
                      {calcSqft.toFixed(0)} sq ft
                    </div>
                    <div
                      className="text-sm font-medium mt-1 capitalize"
                      style={{ color: calcSize ? sizeColors[calcSize] : undefined }}
                    >
                      {calcSize}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Enter width and length to see the size
                  </div>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                Tip: Measure the full floor area of the room. Walls are rarely perfectly square — measure in two spots if possible.
              </p>
            </div>

            <DialogFooter className="mt-4 gap-2 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => setCalcOpen(false)}
                className="flex-1 sm:flex-initial"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleCalcApply}
                disabled={!calcSize || space.prices[calcSize] === null}
                className="flex-1 sm:flex-initial text-white hover:opacity-90"
                style={{ backgroundColor: TERRACOTTA }}
              >
                <Check className="w-4 h-4 mr-1" />
                Select {calcSize ? calcSize.charAt(0).toUpperCase() + calcSize.slice(1) : ""}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
