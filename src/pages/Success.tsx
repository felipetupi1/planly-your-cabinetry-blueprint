import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, AlertCircle, ArrowLeft, CuboidIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectData {
  id: string;
  client_name: string;
  client_email: string;
  stage: string;
  created_at: string | null;
}

interface SpaceData {
  id: string;
  space_label: string;
  size: string | null;
  price: number | null;
  render_3d: boolean | null;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [project, setProject] = useState<ProjectData | null>(null);
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No access token provided.");
      setLoading(false);
      return;
    }

    async function fetchProject() {
      const { data: proj, error: projErr } = await supabase
        .from("projects")
        .select("id, client_name, client_email, stage, created_at")
        .eq("access_token", token!)
        .maybeSingle();

      if (projErr) {
        setError("Could not load project details.");
        setLoading(false);
        return;
      }
      if (!proj) {
        setError("Project not found. Your payment may still be processing — please check back shortly.");
        setLoading(false);
        return;
      }

      setProject(proj);

      const { data: sp } = await supabase
        .from("spaces")
        .select("id, space_label, size, price, render_3d")
        .eq("project_id", proj.id);

      setSpaces(sp || []);
      setLoading(false);
    }

    fetchProject();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-medium text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground font-light">{error}</p>
          <Link to="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = spaces.reduce((s, sp) => s + (sp.price || 0) + (sp.render_3d ? 150 : 0), 0);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-medium text-foreground tracking-wide">
            Payment confirmed
          </h1>
          <p className="text-muted-foreground font-light">
            Thank you, {project?.client_name}! We've received your order.
          </p>
        </div>

        {/* Project details card */}
        <div className="border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium text-foreground">Project summary</h2>

          <div className="space-y-3">
            {spaces.map((sp) => (
              <div key={sp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <span className="font-medium text-foreground">{sp.space_label}</span>
                  {sp.size && (
                    <span className="text-muted-foreground text-sm ml-2 font-light capitalize">{sp.size}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {sp.render_3d && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent flex items-center gap-1">
                      <CuboidIcon className="w-3 h-3" />
                      3D
                    </span>
                  )}
                  <span className="text-foreground font-medium">
                    ${(sp.price || 0) + (sp.render_3d ? 150 : 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {spaces.length > 0 && (
            <div className="pt-3 border-t border-border flex justify-between text-lg font-medium text-foreground">
              <span>Total paid</span>
              <span>${subtotal}</span>
            </div>
          )}
        </div>

        {/* Next steps */}
        <div className="border border-border rounded-lg p-6 space-y-3">
          <h2 className="text-lg font-medium text-foreground">What happens next?</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground font-light text-sm">
            <li>We'll send a confirmation email to <strong className="text-foreground font-medium">{project?.client_email}</strong></li>
            <li>You'll receive measurement instructions and scan links</li>
            <li>Once you submit your scans, we'll begin designing your space</li>
          </ol>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
