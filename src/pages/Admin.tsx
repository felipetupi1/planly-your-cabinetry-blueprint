import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminFinancial } from "@/components/admin/AdminFinancial";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminCMS } from "@/components/admin/AdminCMS";
import { AdminSettings } from "@/components/admin/AdminSettings";

const ADMIN_PASSWORD = "measured2024";

const adminSections = [
  { id: "projects", label: "Projects" },
  { id: "financial", label: "Financial" },
  { id: "portfolio", label: "Portfolio" },
  { id: "reviews", label: "Reviews" },
  { id: "cms", label: "Site Content" },
  { id: "settings", label: "Settings" },
];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground">
              Enter the admin password to continue
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "projects": return <AdminProjects />;
      case "financial": return <AdminFinancial />;
      case "portfolio": return <AdminPortfolio />;
      case "reviews": return <AdminReviews />;
      case "cms": return <AdminCMS />;
      case "settings": return <AdminSettings />;
      default: return <AdminProjects />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside
        className="w-[220px] min-h-screen flex flex-col flex-shrink-0"
        style={{ background: "hsl(218 50% 13%)" }}
      >
        <div className="px-5 py-6">
          <span className="text-[11px] font-medium tracking-[4px] uppercase text-white">
            MEASURED
          </span>
          <div className="mt-1">
            <span className="text-[9px] tracking-[2px] uppercase text-white/40">
              Admin
            </span>
          </div>
        </div>
        <nav className="mt-4 flex-1">
          {adminSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`dash-nav-item w-full text-left ${activeSection === s.id ? "active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="border-b border-border px-12 h-14 flex items-center">
          <span className="dash-label">{adminSections.find((s) => s.id === activeSection)?.label}</span>
        </header>
        <main className="flex-1 px-12 py-8">
          <div className="max-w-[800px]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
