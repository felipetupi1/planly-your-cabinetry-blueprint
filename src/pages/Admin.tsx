import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AdminPortfolio } from "@/components/admin/AdminPortfolio";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminFinancial } from "@/components/admin/AdminFinancial";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { AdminCMS } from "@/components/admin/AdminCMS";
import { AdminSettings } from "@/components/admin/AdminSettings";

const adminSections = [
  { id: "projects", label: "Projects" },
  { id: "financial", label: "Financial" },
  { id: "portfolio", label: "Portfolio" },
  { id: "reviews", label: "Reviews" },
  { id: "cms", label: "Site Content" },
  { id: "settings", label: "Settings" },
];

export default function Admin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState("projects");

  useEffect(() => {
    let mounted = true;

    const verify = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) { setAuthorized(false); setChecking(false); }
        return;
      }
      const { data } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!mounted) return;
      setAuthorized(!!data);
      setChecking(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      verify(session?.user?.id);
    });

    supabase.auth.getSession().then(({ data }) => verify(data.session?.user?.id));

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs text-muted-foreground tracking-wide">Checking access…</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            You need to sign in with a team account to access this area.
          </p>
          <Link to="/login">
            <Button className="w-full">Go to sign in</Button>
          </Link>
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
        <button
          onClick={handleSignOut}
          className="text-[10px] tracking-[2px] uppercase text-white/40 hover:text-white px-5 py-4 text-left"
        >
          Sign out
        </button>
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
