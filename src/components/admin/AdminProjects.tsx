import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  client_name: string;
  client_email: string;
  stage: string;
  created_at: string | null;
  access_token: string;
  spaces: { space_label: string; size: string | null; price: number | null }[];
}

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: projs } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (!projs) { setLoading(false); return; }

      const { data: allSpaces } = await supabase.from("spaces").select("*");
      const spacesByProject = (allSpaces || []).reduce((acc: Record<string, any[]>, s) => {
        if (s.project_id) {
          acc[s.project_id] = acc[s.project_id] || [];
          acc[s.project_id].push(s);
        }
        return acc;
      }, {});

      setProjects(projs.map(p => ({
        ...p,
        spaces: spacesByProject[p.id] || [],
      })));
      setLoading(false);
    })();
  }, []);

  const statuses = ["all", "Payment", "Brief", "In Progress", "1st Draft", "Revision 1", "Revision 2", "Final Production", "Delivered"];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.stage === filter);

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

      {loading ? (
        <div className="mt-6 text-muted-foreground text-sm">Loading projects...</div>
      ) : (
        <div className="mt-6 border border-border rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left p-4 font-medium text-foreground tracking-wide">Client</th>
                <th className="text-left p-4 font-medium text-foreground tracking-wide">ID</th>
                <th className="text-left p-4 font-medium text-foreground tracking-wide">Spaces</th>
                <th className="text-left p-4 font-medium text-foreground tracking-wide">Status</th>
                <th className="text-left p-4 font-medium text-foreground tracking-wide">Date</th>
                <th className="text-right p-4 font-medium text-foreground tracking-wide">Total</th>
                <th className="text-right p-4 font-medium text-foreground tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No projects found.</td></tr>
              )}
              {filtered.map((p) => {
                const total = p.spaces.reduce((s, sp) => s + (sp.price || 0), 0);
                const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="text-foreground font-medium">{p.client_name}</div>
                      <div className="text-xs text-muted-foreground font-light">{p.client_email}</div>
                    </td>
                    <td className="p-4 text-muted-foreground font-light">{p.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-muted-foreground font-light">
                      {p.spaces.map(s => `${s.space_label} (${s.size || '?'})`).join(", ") || "—"}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[p.stage] || ""}`}>
                        {p.stage}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-light">{dateStr}</td>
                    <td className="p-4 text-right text-foreground font-medium">${total}</td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm">Manage</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
