import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";

const ADMIN_PASSWORD = "planly2024"; // Placeholder

interface Project {
  id: string;
  client: string;
  spaces: string[];
  status: string;
  date: string;
}

const mockProjects: Project[] = [
  { id: "proj-001", client: "Maria Santos", spaces: ["Kitchen (M)", "Pantry (S)"], status: "Brief", date: "Mar 7, 2026" },
  { id: "proj-002", client: "John Smith", spaces: ["Closet (L)", "Bedroom (M)"], status: "In Progress", date: "Mar 5, 2026" },
  { id: "proj-003", client: "Ana Lima", spaces: ["Kitchen (L)"], status: "Review", date: "Mar 1, 2026" },
];

const statusColors: Record<string, string> = {
  Brief: "bg-secondary text-secondary-foreground",
  "In Progress": "bg-primary/10 text-primary",
  Review: "bg-accent text-accent-foreground",
  Approved: "bg-success/20 text-success",
  Delivered: "bg-success text-success-foreground",
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-2xl font-bold text-foreground text-center">Admin Access</h1>
          <div className="mt-6 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter password"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">Incorrect password.</p>}
            <Button variant="hero" className="w-full" onClick={login}>
              Enter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 h-14 flex items-center">
        <span className="font-heading text-lg font-bold text-foreground">Planly Admin</span>
      </header>
      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">Active Projects</h2>
            <div className="mt-6 border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-4 font-medium text-foreground">Client</th>
                    <th className="text-left p-4 font-medium text-foreground">Spaces</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Date</th>
                    <th className="text-right p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-4 text-foreground font-medium">{p.client}</td>
                      <td className="p-4 text-muted-foreground">{p.spaces.join(", ")}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[p.status] || ""}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.date}</td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <AdminPortfolio />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
