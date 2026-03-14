import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminFinancial } from "@/components/admin/AdminFinancial";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminCMS } from "@/components/admin/AdminCMS";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";

const ADMIN_PASSWORD = "measured2024";

const adminSections = [
  { id: "projects", label: "Projects" },
  { id: "financial", label: "Financial", adminOnly: true },
  { id: "portfolio", label: "Portfolio" },
  { id: "reviews", label: "Reviews" },
  { id: "cms", label: "Site Content" },
  { id: "settings", label: "Settings", adminOnly: true },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");

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
          <h1 className="dash-title text-center text-foreground">MEASURED</h1>
          <p className="mt-2 text-center dash-label">Admin Access</p>
          <div className="mt-8 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter password"
              className="w-full border border-input rounded-[2px] px-3 py-2.5 text-xs font-light bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-xs text-destructive">Incorrect password.</p>}
            <Button variant="hero" className="w-full" onClick={login}>Enter</Button>
          </div>
        </div>
      </div>
    );
  }

  const visibleSections = adminSections.filter(
    (s) => !s.adminOnly || !isTeamMember
  );

  const renderContent = () => {
    switch (activeSection) {
      case "projects": return <AdminProjects />;
      case "financial": return !isTeamMember ? <AdminFinancial /> : null;
      case "portfolio": return <AdminPortfolio />;
      case "reviews": return <AdminReviews />;
      case "cms": return <AdminCMS />;
      case "settings": return !isTeamMember ? <AdminSettings /> : null;
      default: return <AdminProjects />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Admin sidebar — darker navy */}
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
              {isTeamMember ? "Team" : "Admin"}
            </span>
          </div>
        </div>
        <nav className="mt-4 flex-1">
          {visibleSections.map((s) => (
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="border-b border-border px-12 h-14 flex items-center">
          <span className="dash-label">{visibleSections.find((s) => s.id === activeSection)?.label}</span>
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
