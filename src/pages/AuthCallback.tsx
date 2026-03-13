import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your login...");

  useEffect(() => {
    const handleCallback = async () => {
      // Wait for the session to be established from the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        setStatus("Login failed. Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const userEmail = session.user.email;

      // Check if user is a team member
      const { data: teamMember } = await supabase
        .from("team_members")
        .select("id, role")
        .eq("email", userEmail!)
        .maybeSingle();

      if (teamMember) {
        navigate("/admin");
        return;
      }

      // Check if they have a project by email
      const { data: project } = await supabase
        .from("projects")
        .select("access_token")
        .eq("client_email", userEmail!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (project) {
        navigate(`/dashboard?token=${project.access_token}`);
        return;
      }

      // No project found
      setStatus("No project found for this email. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-xs text-muted-foreground tracking-wide">{status}</p>
    </div>
  );
}
