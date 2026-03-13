import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, spaceKey, spaceLabel } = await req.json();

    if (!projectId || !spaceKey) {
      return new Response(JSON.stringify({ error: "Missing projectId or spaceKey" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cubicasaApiKey = Deno.env.get("CUBICASA_API_KEY");
    if (!cubicasaApiKey) {
      return new Response(JSON.stringify({ error: "CubiCasa API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Get a GoToScan token from CubiCasa
    const tokenRes = await fetch("https://api.cubi.casa/conversion/gotoscan/token", {
      method: "GET",
      headers: { "X-API-KEY": cubicasaApiKey },
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error(`CubiCasa token error [${tokenRes.status}]: ${errText}`);
      return new Response(JSON.stringify({ error: "Failed to get CubiCasa token" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenData = await tokenRes.json();
    const goToScanToken = tokenData.token || tokenData;
    console.log("CubiCasa token obtained successfully");

    // Step 2: Build the GoToScan link
    const externalId = `${projectId}-${spaceKey}-${Date.now()}`;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const webhookUrl = `${supabaseUrl}/functions/v1/cubicasa-webhook`;

    const params = new URLSearchParams({
      token: typeof goToScanToken === "string" ? goToScanToken : JSON.stringify(goToScanToken),
      conversion_type: "t3",
      external_id: externalId,
      webhook_url: webhookUrl,
      priority: "fast",
    });

    const scanLink = `https://gotoscan.io/scan/?${params.toString()}`;

    // Step 3: Update the spaces table
    const supabase = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await supabase
      .from("spaces")
      .update({
        scan_status: "pending",
        scan_link: scanLink,
      })
      .eq("project_id", projectId)
      .eq("space_key", spaceKey);

    if (updateError) {
      console.error("Spaces update error:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Scan link generated for project=${projectId} space=${spaceKey}`);

    return new Response(JSON.stringify({ scanLink, externalId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cubicasa-gotoscan error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
