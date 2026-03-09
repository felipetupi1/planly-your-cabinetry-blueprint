import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical, Pencil, Check, X, Eye, EyeOff } from "lucide-react";

export interface ServiceItem {
  id: string;
  name: string;
  smallPrice: number;
  mediumPrice: number;
  largePrice: number | null;
  sizeRef: string;
  active: boolean;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "s1", name: "Kitchen", smallPrice: 350, mediumPrice: 550, largePrice: 850, sizeRef: "Most kitchens are 100–200 sq/ft", active: true },
  { id: "s2", name: "Living / Family Room", smallPrice: 300, mediumPrice: 500, largePrice: 750, sizeRef: "Most living rooms are 150–250 sq/ft", active: true },
  { id: "s3", name: "Closet", smallPrice: 250, mediumPrice: 400, largePrice: 600, sizeRef: "Most closets are 25–100 sq/ft", active: true },
  { id: "s4", name: "Pantry", smallPrice: 200, mediumPrice: 350, largePrice: null, sizeRef: "Most pantries are under 80 sq/ft", active: true },
  { id: "s5", name: "Bathroom", smallPrice: 200, mediumPrice: 350, largePrice: 500, sizeRef: "Most bathrooms are 40–100 sq/ft", active: true },
  { id: "s6", name: "Home Office", smallPrice: 250, mediumPrice: 400, largePrice: 600, sizeRef: "Most home offices are 80–150 sq/ft", active: true },
  { id: "s7", name: "Bedroom", smallPrice: 250, mediumPrice: 400, largePrice: 600, sizeRef: "Most bedrooms are 100–200 sq/ft", active: true },
  { id: "s8", name: "Mudroom", smallPrice: 200, mediumPrice: 300, largePrice: 450, sizeRef: "Most mudrooms are 40–100 sq/ft", active: true },
];

interface EditState {
  name: string;
  smallPrice: string;
  mediumPrice: string;
  largePrice: string;
  largeEnabled: boolean;
  sizeRef: string;
}

function toEditState(s: ServiceItem): EditState {
  return {
    name: s.name,
    smallPrice: String(s.smallPrice),
    mediumPrice: String(s.mediumPrice),
    largePrice: s.largePrice !== null ? String(s.largePrice) : "",
    largeEnabled: s.largePrice !== null,
    sizeRef: s.sizeRef,
  };
}

export function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState<EditState>({
    name: "", smallPrice: "", mediumPrice: "", largePrice: "", largeEnabled: true, sizeRef: "",
  });
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const startEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setEditState(toEditState(s));
  };

  const cancelEdit = () => { setEditingId(null); setEditState(null); };

  const saveEdit = () => {
    if (!editState || !editingId) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: editState.name,
              smallPrice: Number(editState.smallPrice) || 0,
              mediumPrice: Number(editState.mediumPrice) || 0,
              largePrice: editState.largeEnabled ? (Number(editState.largePrice) || 0) : null,
              sizeRef: editState.sizeRef,
            }
          : s
      )
    );
    cancelEdit();
  };

  const toggleActive = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addService = () => {
    if (!newService.name.trim()) return;
    setServices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newService.name,
        smallPrice: Number(newService.smallPrice) || 0,
        mediumPrice: Number(newService.mediumPrice) || 0,
        largePrice: newService.largeEnabled ? (Number(newService.largePrice) || 0) : null,
        sizeRef: newService.sizeRef,
        active: true,
      },
    ]);
    setNewService({ name: "", smallPrice: "", mediumPrice: "", largePrice: "", largeEnabled: true, sizeRef: "" });
    setShowAdd(false);
  };

  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setServices((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(i);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Service Manager</h3>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Manage spaces, pricing, and display order. Changes reflect instantly on the public site.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> Add service
        </Button>
      </div>

      {showAdd && (
        <div className="mb-6 border border-accent/30 rounded-lg p-5 space-y-3">
          <h4 className="text-sm font-medium text-foreground">New Service</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground tracking-wide uppercase">Space Name</label>
              <Input value={newService.name} onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))} className="mt-1" placeholder="e.g. Laundry Room" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wide uppercase">Size Reference</label>
              <Input value={newService.sizeRef} onChange={(e) => setNewService((p) => ({ ...p, sizeRef: e.target.value }))} className="mt-1" placeholder="e.g. Most laundry rooms are 30–60 sq/ft" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground tracking-wide uppercase">Small Price ($)</label>
              <Input type="number" value={newService.smallPrice} onChange={(e) => setNewService((p) => ({ ...p, smallPrice: e.target.value }))} className="mt-1" min="0" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wide uppercase">Medium Price ($)</label>
              <Input type="number" value={newService.mediumPrice} onChange={(e) => setNewService((p) => ({ ...p, mediumPrice: e.target.value }))} className="mt-1" min="0" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground tracking-wide uppercase">Large Price ($)</label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={newService.largePrice}
                  onChange={(e) => setNewService((p) => ({ ...p, largePrice: e.target.value }))}
                  disabled={!newService.largeEnabled}
                  className={!newService.largeEnabled ? "opacity-40" : ""}
                  min="0"
                />
                <button
                  onClick={() => setNewService((p) => ({ ...p, largeEnabled: !p.largeEnabled }))}
                  className={`text-xs whitespace-nowrap px-2 py-1 rounded border transition-colors ${newService.largeEnabled ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
                >
                  {newService.largeEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="hero" size="sm" onClick={addService}>Add</Button>
            <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Service list */}
      <div className="space-y-2">
        {services.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`border rounded-lg p-4 transition-colors ${
              !s.active ? "border-border/50 bg-muted/30 opacity-60" : "border-border"
            } ${dragIdx === i ? "ring-2 ring-accent/40" : ""}`}
          >
            {editingId === s.id && editState ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground tracking-wide uppercase">Space Name</label>
                    <Input value={editState.name} onChange={(e) => setEditState((p) => p && ({ ...p, name: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground tracking-wide uppercase">Size Reference</label>
                    <Input value={editState.sizeRef} onChange={(e) => setEditState((p) => p && ({ ...p, sizeRef: e.target.value }))} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground tracking-wide uppercase">Small ($)</label>
                    <Input type="number" value={editState.smallPrice} onChange={(e) => setEditState((p) => p && ({ ...p, smallPrice: e.target.value }))} className="mt-1" min="0" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground tracking-wide uppercase">Medium ($)</label>
                    <Input type="number" value={editState.mediumPrice} onChange={(e) => setEditState((p) => p && ({ ...p, mediumPrice: e.target.value }))} className="mt-1" min="0" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground tracking-wide uppercase">Large ($)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        value={editState.largePrice}
                        onChange={(e) => setEditState((p) => p && ({ ...p, largePrice: e.target.value }))}
                        disabled={!editState.largeEnabled}
                        className={!editState.largeEnabled ? "opacity-40" : ""}
                        min="0"
                      />
                      <button
                        onClick={() => setEditState((p) => p && ({ ...p, largeEnabled: !p.largeEnabled }))}
                        className={`text-xs whitespace-nowrap px-2 py-1 rounded border transition-colors ${editState.largeEnabled ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
                      >
                        {editState.largeEnabled ? "On" : "Off"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="hero" size="sm" onClick={saveEdit}><Check className="w-3 h-3 mr-1" /> Save</Button>
                  <Button variant="outline" size="sm" onClick={cancelEdit}><X className="w-3 h-3 mr-1" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{s.name}</span>
                    {!s.active && (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">{s.sizeRef}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-light">
                  <span>${s.smallPrice}</span>
                  <span>${s.mediumPrice}</span>
                  <span>{s.largePrice !== null ? `$${s.largePrice}` : "—"}</span>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => toggleActive(s.id)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title={s.active ? "Deactivate" : "Activate"}>
                    {s.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(s)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteService(s.id)} className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fixed Custom Space note */}
      <div className="mt-4 border border-dashed border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <span className="font-medium text-foreground text-sm">Custom Space</span>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Always visible as a fallback option. Client types their space name and is directed to a quote request form.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">Fixed</span>
      </div>

      {/* Column headers hint */}
      <p className="text-[11px] text-muted-foreground font-light mt-4 text-right">
        Prices shown: Small (&lt;80 sq/ft) · Medium (80–160 sq/ft) · Large (&gt;160 sq/ft)
      </p>
    </div>
  );
}
