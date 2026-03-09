import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  client: string;
  email: string;
  spaces: string[];
  status: string;
  date: string;
  amount: number;
  hasBrief: boolean;
}

const mockProjects: Project[] = [
  { id: "MEAS-001", client: "Maria Santos", email: "maria@email.com", spaces: ["Kitchen (M)", "Pantry (S)"], status: "Brief", date: "Mar 7, 2026", amount: 810, hasBrief: false },
  { id: "MEAS-002", client: "John Smith", email: "john@email.com", spaces: ["Closet (L)", "Bedroom (M)"], status: "In Progress", date: "Mar 5, 2026", amount: 1080, hasBrief: true },
  { id: "MEAS-003", client: "Ana Lima", email: "ana@email.com", spaces: ["Kitchen (L)"], status: "1st Draft", date: "Mar 1, 2026", amount: 850, hasBrief: true },
];

const statusColors: Record<string, string> = {
  Payment: "bg-secondary text-secondary-foreground",
  Brief: "bg-accent/10 text-accent",
  "In Progress": "bg-primary/10 text-primary",
  "1st Draft": "bg-primary/20 text-primary",
  "Revision 1": "bg-accent/20 text-accent",
  "Revision 2": "bg-accent/20 text-accent",
  "Final Production": "bg-success/20 text-success",
  Delivered: "bg-success text-success-foreground",
};

export function AdminProjects() {
  const [filter, setFilter] = useState("all");

  const statuses = ["all", "Payment", "Brief", "In Progress", "1st Draft", "Revision 1", "Revision 2", "Final Production", "Delivered"];
  const filtered = filter === "all" ? mockProjects : mockProjects.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-foreground tracking-wide">Projects</h2>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors tracking-wide ${
              filter === s ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="mt-6 border border-border rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left p-4 font-medium text-foreground tracking-wide">Client</th>
              <th className="text-left p-4 font-medium text-foreground tracking-wide">ID</th>
              <th className="text-left p-4 font-medium text-foreground tracking-wide">Spaces</th>
              <th className="text-left p-4 font-medium text-foreground tracking-wide">Status</th>
              <th className="text-left p-4 font-medium text-foreground tracking-wide">Date</th>
              <th className="text-right p-4 font-medium text-foreground tracking-wide">Paid</th>
              <th className="text-right p-4 font-medium text-foreground tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4">
                  <div className="text-foreground font-medium">{p.client}</div>
                  <div className="text-xs text-muted-foreground font-light">{p.email}</div>
                </td>
                <td className="p-4 text-muted-foreground font-light">{p.id}</td>
                <td className="p-4 text-muted-foreground font-light">{p.spaces.join(", ")}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[p.status] || ""}`}>
                      {p.status}
                    </span>
                    {!p.hasBrief && p.status === "Brief" && (
                      <span className="text-xs text-accent">⚑ Awaiting brief</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-muted-foreground font-light">{p.date}</td>
                <td className="p-4 text-right text-foreground font-medium">${p.amount}</td>
                <td className="p-4 text-right">
                  <Button variant="outline" size="sm">Manage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
