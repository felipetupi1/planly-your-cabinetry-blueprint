import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedAdmin() {
  const [state, setState] = useState<"loading" | "authorized" | "unauthorized">("loading");
  const [teamRole, setTeamRole] = useState("admin");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState("unauthorized");
        return;
      }

      const { data: teamMember } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (teamMember) {
        setTeamRole(teamMember.role);
        setState("authorized");
      } else {
        setState("unauthorized");
      }
    };
    check();
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs text-muted-foreground tracking-wide">Loading...</p>
      </div>
    );
  }

  if (state === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return <Admin teamRole={teamRole} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<Dashboard />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
