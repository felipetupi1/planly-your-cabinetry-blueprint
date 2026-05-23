import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cubicasa-secret",
};

const ALLOWED_URL_HOSTS = [
  "cubi.casa",
  "cubicasa.com",
  "gotoscan.io",
  "cubicasa3d.com",
];

function isAllowedFloorPlanUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return ALLOWED_URL_HOSTS.some(
      (h) => u.hostname === h || u.hostname.endsWith(`.${h}`)
    );
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // AUTH: require per-scan token (?t=...) which must match spaces.webhook_token
    const url = new URL(req.url);
    const providedToken = url.searchParams.get("t");
    if (!providedToken) {
      console.error("cubicasa-webhook rejected: missing token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    console.log("CubiCasa webhook payload:", JSON.stringify(payload));

    const externalId = payload.external_id;
    const status = payload.status;

    if (!externalId || typeof externalId !== "string") {
      return new Response(JSON.stringify({ error: "Missing external_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parts = externalId.split("-");
    if (parts.length < 7) {
      console.error("Invalid external_id format:", externalId);
      return new Response(JSON.stringify({ error: "Invalid external_id format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const projectId = parts.slice(0, 5).join("-");
    const spaceKey = parts.slice(5, parts.length - 1).join("-");

    console.log(`Parsed: projectId=${projectId}, spaceKey=${spaceKey}, status=${status}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Defense-in-depth: only accept updates for spaces with a pending scan AND matching token.
    const { data: existing, error: lookupErr } = await supabase
      .from("spaces")
      .select("id, scan_status, webhook_token")
      .eq("project_id", projectId)
      .eq("space_key", spaceKey)
      .maybeSingle();

    if (lookupErr || !existing) {
      console.error("Space lookup failed:", lookupErr);
      return new Response(JSON.stringify({ error: "Unknown space" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!existing.webhook_token || existing.webhook_token !== providedToken) {
      console.error("cubicasa-webhook rejected: token mismatch");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existing.scan_status !== "pending") {
      console.warn(`Ignoring webhook: space ${existing.id} status is '${existing.scan_status}', not 'pending'`);
      return new Response(JSON.stringify({ ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawUrl = payload.tour || payload.floor_plan_url || payload.url || null;
    const floorPlanUrl = rawUrl && isAllowedFloorPlanUrl(rawUrl) ? rawUrl : null;
    if (rawUrl && !floorPlanUrl) {
      console.warn(`Rejecting floor plan URL from disallowed host: ${rawUrl}`);
    }

    // Clear webhook_token on success so it can't be replayed.
    const updateData: Record<string, any> = { scan_status: "received", webhook_token: null };
    if (floorPlanUrl) updateData.floor_plan_url = floorPlanUrl;

    const { error: updateError } = await supabase
      .from("spaces")
      .update(updateData)
      .eq("id", existing.id);

    if (updateError) {
      console.error("Space update error:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Space updated: project=${projectId}, space=${spaceKey}, status=received`);

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cubicasa-webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
