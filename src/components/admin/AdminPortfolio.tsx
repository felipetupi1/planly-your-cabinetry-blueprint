import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, GripVertical, Trash2, Plus } from "lucide-react";

const SPACE_TYPES = [
  "Kitchen", "Living / Family Room", "Closet", "Pantry",
  "Vanity / Bathroom", "Home Office", "Bedroom", "Mudroom",
];

const CATEGORIES = ["render", "document"] as const;
type Category = (typeof CATEGORIES)[number];

interface PortfolioEntry {
  id: string;
  file: File | null;
  preview: string;
  category: Category;
  spaceType: string;
  description: string;
}

export function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioEntry[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [addCategory, setAddCategory] = useState<Category>("render");

  const addItem = (file: File) => {
    const entry: PortfolioEntry = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      category: addCategory,
      spaceType: "Kitchen",
      description: "",
    };
    setItems((prev) => [...prev, entry]);
  };

  const updateItem = (id: string, updates: Partial<PortfolioEntry>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(idx);
  };

  const handleDragEnd = () => setDragIdx(null);

  const renders = items.filter((i) => i.category === "render");
  const docs = items.filter((i) => i.category === "document");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Portfolio</h2>
        <div className="flex items-center gap-2">
          <select
            value={addCategory}
            onChange={(e) => setAddCategory(e.target.value as Category)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
          >
            <option value="render">Render</option>
            <option value="document">Construction Document</option>
          </select>
          <Button
            variant="default"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add image
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addItem(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Drag items to reorder. Changes are local for now — enable Cloud for persistence.
      </p>

      {items.length === 0 && (
        <div className="mt-8 border-2 border-dashed border-border rounded-xl p-12 text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="mt-3 text-muted-foreground">No portfolio images yet. Click "Add image" to start.</p>
        </div>
      )}

      {renders.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Renders</h3>
          <div className="space-y-3">
            {renders.map((item) => {
              const globalIdx = items.findIndex((i) => i.id === item.id);
              return (
                <PortfolioRow
                  key={item.id}
                  item={item}
                  idx={globalIdx}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIdx === globalIdx}
                />
              );
            })}
          </div>
        </div>
      )}

      {docs.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Construction Documents</h3>
          <div className="space-y-3">
            {docs.map((item) => {
              const globalIdx = items.findIndex((i) => i.id === item.id);
              return (
                <PortfolioRow
                  key={item.id}
                  item={item}
                  idx={globalIdx}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={dragIdx === globalIdx}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioRow({
  item,
  idx,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: {
  item: PortfolioEntry;
  idx: number;
  onUpdate: (id: string, u: Partial<PortfolioEntry>) => void;
  onRemove: (id: string) => void;
  onDragStart: (idx: number) => void;
  onDragOver: (e: React.DragEvent, idx: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={(e) => onDragOver(e, idx)}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-4 border border-border rounded-xl p-3 transition-opacity ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab flex-shrink-0" />
      <img
        src={item.preview}
        alt=""
        className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 grid grid-cols-2 gap-2">
        <select
          value={item.spaceType}
          onChange={(e) => onUpdate(item.id, { spaceType: e.target.value })}
          className="text-sm border border-border rounded-lg px-2 py-1.5 bg-background text-foreground"
        >
          {SPACE_TYPES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          value={item.description}
          onChange={(e) => onUpdate(item.id, { description: e.target.value })}
          placeholder="Description (optional)"
          className="text-sm border border-border rounded-lg px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-muted-foreground hover:text-destructive flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
