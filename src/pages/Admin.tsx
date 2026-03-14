import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminFinancial } from "@/components/admin/AdminFinancial";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminCMS } from "@/components/admin/AdminCMS";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const adminSections = [
  { id: "projects", label: "Projects" },
  { id: "financial", label: "Financial", adminOnly: true },
  { id: "portfolio", label: "Portfolio" },
  { id: "reviews", label: "Reviews" },
  { id: "cms", label: "Site Content" },
  { id: "settings", label: "Settings", adminOnly: true },
];

export default function Admin({ teamRole }: { teamRole: string }) {
  const [activeSection, setActiveSection] = useState("projects");
  const isTeamMember = teamRole === "team";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

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
        <div className="mt-auto pb-4 space-y-1">
          <ChangePasswordModal />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-white/40 hover:text-white/70 transition-colors px-5 py-2"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      </aside>

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
