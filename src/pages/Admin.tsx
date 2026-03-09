import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminFinancial } from "@/components/admin/AdminFinancial";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminCMS } from "@/components/admin/AdminCMS";
import { AdminSettings } from "@/components/admin/AdminSettings";

const ADMIN_PASSWORD = "measured2024";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setIsTeamMember(false);
      setError(false);
    } else if (password === "team2024") {
      setAuthed(true);
      setIsTeamMember(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-medium text-foreground text-center tracking-[4px] uppercase">
            MEASURED
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground font-light">Admin Access</p>
          <div className="mt-8 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter password"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">Incorrect password.</p>}
            <Button variant="hero" className="w-full" onClick={login}>Enter</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground tracking-[4px] uppercase">MEASURED ADMIN</span>
        <span className="text-xs text-muted-foreground">{isTeamMember ? "Team Member" : "Admin"}</span>
      </header>
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <Tabs defaultValue="projects">
          <TabsList className="flex-wrap">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            {!isTeamMember && <TabsTrigger value="financial">Financial</TabsTrigger>}
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="cms">Site Content</TabsTrigger>
            {!isTeamMember && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <AdminProjects />
          </TabsContent>

          {!isTeamMember && (
            <TabsContent value="financial" className="mt-6">
              <AdminFinancial />
            </TabsContent>
          )}

          <TabsContent value="portfolio" className="mt-6">
            <AdminPortfolio />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="cms" className="mt-6">
            <AdminCMS />
          </TabsContent>

          {!isTeamMember && (
            <TabsContent value="settings" className="mt-6">
              <AdminSettings />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
