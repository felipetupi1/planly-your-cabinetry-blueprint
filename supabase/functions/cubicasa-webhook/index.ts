import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("CubiCasa webhook payload:", JSON.stringify(payload));

    // CubiCasa webhook sends: { external_id, status, previous_status, tour, ... }
    const externalId = payload.external_id;
    const status = payload.status;

    if (!externalId) {
      console.error("Missing external_id in webhook payload");
      return new Response(JSON.stringify({ error: "Missing external_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse external_id format: {projectId}-{spaceKey}-{timestamp}
    const parts = externalId.split("-");
    // UUID is 5 segments (8-4-4-4-12), so projectId = first 5 parts joined
    // spaceKey is everything between projectId and the last part (timestamp)
    // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-spacekey-timestamp
    // We need to reconstruct: projectId (UUID) and spaceKey
    if (parts.length < 7) {
      console.error("Invalid external_id format:", externalId);
      return new Response(JSON.stringify({ error: "Invalid external_id format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const projectId = parts.slice(0, 5).join("-");
    const timestamp = parts[parts.length - 1];
    const spaceKey = parts.slice(5, parts.length - 1).join("-");

    console.log(`Parsed: projectId=${projectId}, spaceKey=${spaceKey}, status=${status}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Extract floor plan URL from the webhook payload
    // CubiCasa may provide a tour URL or direct floor plan link
    const floorPlanUrl = payload.tour || payload.floor_plan_url || payload.url || null;

    // Update the space record
    const updateData: Record<string, any> = {
      scan_status: "received",
    };

    if (floorPlanUrl) {
      updateData.floor_plan_url = floorPlanUrl;
    }

    const { error: updateError } = await supabase
      .from("spaces")
      .update(updateData)
      .eq("project_id", projectId)
      .eq("space_key", spaceKey);

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
