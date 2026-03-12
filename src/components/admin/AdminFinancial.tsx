import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RevenueEntry {
  id: string;
  client_name: string;
  amount: number;
  date: string;
  spaces: string;
}

interface CostEntry {
  id: string;
  description: string;
  amount: number;
}

export function AdminFinancial() {
  const [costs, setCosts] = useState<CostEntry[]>([]);
  const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [period, setPeriod] = useState<"month" | "quarter" | "all">("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Fetch projects + spaces for revenue
      const { data: projs } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      const { data: allSpaces } = await supabase.from("spaces").select("*");
      const { data: dbCosts } = await supabase.from("costs").select("*");

      if (projs && allSpaces) {
        const spacesByProject = allSpaces.reduce((acc: Record<string, any[]>, s) => {
          if (s.project_id) { acc[s.project_id] = acc[s.project_id] || []; acc[s.project_id].push(s); }
          return acc;
        }, {});
        setRevenue(projs.map(p => ({
          id: p.id,
          client_name: p.client_name,
          amount: (spacesByProject[p.id] || []).reduce((s: number, sp: any) => s + (sp.price || 0), 0),
          date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          spaces: (spacesByProject[p.id] || []).map((sp: any) => sp.space_label).join(", "),
        })));
      }

      if (dbCosts) setCosts(dbCosts.map(c => ({ id: c.id, description: c.description, amount: c.amount })));
      setLoading(false);
    })();
  }, []);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const grossMargin = totalRevenue - totalCosts;

  const addCost = async () => {
    if (!newLabel.trim() || !newAmount) return;
    const { data } = await supabase.from("costs").insert({ description: newLabel.trim(), amount: parseFloat(newAmount) }).select().single();
    if (data) setCosts(prev => [...prev, { id: data.id, description: data.description, amount: data.amount }]);
    setNewLabel("");
    setNewAmount("");
  };

  const removeCost = async (id: string) => {
    await supabase.from("costs").delete().eq("id", id);
    setCosts(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-medium text-foreground tracking-wide">Financial Dashboard</h2>

      <div className="mt-4 flex gap-2">
        {(["month", "quarter", "all"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors tracking-wide capitalize ${
              period === p ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {p === "all" ? "All time" : p === "month" ? "This month" : "This quarter"}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs text-muted-foreground tracking-wide uppercase">Revenue</div>
          <div className="mt-1 text-2xl font-medium text-foreground">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs text-muted-foreground tracking-wide uppercase">Costs</div>
          <div className="mt-1 text-2xl font-medium text-foreground">${totalCosts.toLocaleString()}</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-xs text-muted-foreground tracking-wide uppercase">Gross Margin</div>
          <div className="mt-1 text-2xl font-medium text-success">${grossMargin.toLocaleString()}</div>
          {totalRevenue > 0 && <div className="text-xs text-muted-foreground mt-1">{((grossMargin / totalRevenue) * 100).toFixed(1)}%</div>}
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-foreground tracking-wide">Transactions</h3>
        <div className="mt-4 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="text-left p-3 font-medium text-foreground">Client</th>
                <th className="text-left p-3 font-medium text-foreground">Spaces</th>
                <th className="text-left p-3 font-medium text-foreground">Date</th>
                <th className="text-right p-3 font-medium text-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 text-foreground">{r.client_name}</td>
                  <td className="p-3 text-muted-foreground font-light">{r.spaces}</td>
                  <td className="p-3 text-muted-foreground font-light">{r.date}</td>
                  <td className="p-3 text-right text-foreground font-medium">${r.amount}</td>
                </tr>
              ))}
              {revenue.length === 0 && (
                <tr><td colSpan={4} className="p-3 text-center text-muted-foreground">No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost entries */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-foreground tracking-wide">Cost Entries</h3>
        <div className="mt-4 space-y-2">
          {costs.map((c) => (
            <div key={c.id} className="flex items-center justify-between border border-border rounded-lg p-3">
              <span className="text-foreground">{c.description}</span>
              <div className="flex items-center gap-3">
                <span className="text-foreground font-medium">${c.amount}</span>
                <button onClick={() => removeCost(c.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="flex-1" />
            <Input placeholder="Amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-28" />
            <Button variant="outline" size="sm" onClick={addCost}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
      </div>
    </div>
  );
}
