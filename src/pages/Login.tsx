import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [mode, setMode] = useState<"client" | "team">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClientLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent you a magic link to access your project." });
    }
  };

  const handleTeamLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      window.location.href = "/admin";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "client") {
      handleClientLogin();
    } else {
      handleTeamLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <h1 className="text-[11px] font-medium tracking-[4px] uppercase text-foreground text-center">
          MEASURED
        </h1>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {mode === "client" ? "Access your project" : "Team sign in"}
        </p>

        {/* Mode toggle */}
        <div className="mt-8 flex border border-border rounded-[2px] overflow-hidden">
          <button
            type="button"
            onClick={() => setMode("client")}
            className={`flex-1 py-2 text-[10px] font-medium uppercase tracking-[2px] transition-colors ${
              mode === "client"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setMode("team")}
            className={`flex-1 py-2 text-[10px] font-medium uppercase tracking-[2px] transition-colors ${
              mode === "team"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Team
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />
          {mode === "team" && (
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          )}
          <Button variant="hero" className="w-full" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "client"
              ? "Send Magic Link"
              : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          {mode === "client"
            ? "Enter the email you used when purchasing. We'll send a link to view your project."
            : "Sign in with your team credentials."}
        </p>
      </div>
    </div>
  );
}
