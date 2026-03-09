import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Plus, Check, X } from "lucide-react";

interface Review {
  id: string;
  text: string;
  clientName: string;
  spaceType: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
}

const mockReviews: Review[] = [
  { id: "1", text: "Amazing work on our kitchen project. The documents were incredibly detailed.", clientName: "Maria S.", spaceType: "Kitchen", rating: 5, status: "pending" },
  { id: "2", text: "The 3D render helped us visualize everything perfectly.", clientName: "John D.", spaceType: "Closet", rating: 5, status: "approved" },
  { id: "3", text: "Fast delivery and professional communication throughout.", clientName: "Carlos M.", spaceType: "Pantry", rating: 5, status: "approved" },
];

const SPACE_TYPES = ["Kitchen", "Living / Family Room", "Closet", "Pantry", "Bathroom", "Home Office", "Bedroom", "Mudroom"];

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showAdd, setShowAdd] = useState(false);
  const [newReview, setNewReview] = useState({ text: "", clientName: "", spaceType: "Kitchen", rating: 5 });

  const updateStatus = (id: string, status: Review["status"]) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const addManualReview = () => {
    if (!newReview.text.trim() || !newReview.clientName.trim()) return;
    setReviews((prev) => [
      ...prev,
      { ...newReview, id: crypto.randomUUID(), status: "approved" },
    ]);
    setNewReview({ text: "", clientName: "", spaceType: "Kitchen", rating: 5 });
    setShowAdd(false);
  };

  const pending = reviews.filter((r) => r.status === "pending");
  const approved = reviews.filter((r) => r.status === "approved");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-foreground tracking-wide">Reviews</h2>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> Add manual review
        </Button>
      </div>

      {showAdd && (
        <div className="mt-4 border border-border rounded-lg p-5 space-y-3">
          <textarea
            value={newReview.text}
            onChange={(e) => setNewReview((p) => ({ ...p, text: e.target.value }))}
            placeholder="Review text..."
            rows={3}
            className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Client name" value={newReview.clientName} onChange={(e) => setNewReview((p) => ({ ...p, clientName: e.target.value }))} />
            <select
              value={newReview.spaceType}
              onChange={(e) => setNewReview((p) => ({ ...p, spaceType: e.target.value }))}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
            >
              {SPACE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview((p) => ({ ...p, rating: parseInt(e.target.value) }))}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
            >
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
          <Button variant="hero" size="sm" onClick={addManualReview}>Add review</Button>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-foreground tracking-wide mb-4">Pending Approval</h3>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="border border-accent/30 rounded-lg p-4">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground font-light">{r.text}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{r.clientName} · {r.spaceType}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateStatus(r.id, "rejected")}>
                      <X className="w-3 h-3 mr-1" /> Reject
                    </Button>
                    <Button variant="hero" size="sm" onClick={() => updateStatus(r.id, "approved")}>
                      <Check className="w-3 h-3 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-foreground tracking-wide mb-4">
          Approved ({approved.length})
        </h3>
        <div className="space-y-3">
          {approved.map((r) => (
            <div key={r.id} className="border border-border rounded-lg p-4">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground font-light">{r.text}</p>
              <span className="text-xs text-muted-foreground mt-2 block">{r.clientName} · {r.spaceType}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
