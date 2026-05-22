import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, spaceKey, spaceLabel, accessToken } = await req.json();

    // Input validation
    if (!projectId || !spaceKey || typeof projectId !== "string" || typeof spaceKey !== "string") {
      return new Response(JSON.stringify({ error: "Missing projectId or spaceKey" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!UUID_RE.test(projectId)) {
      return new Response(JSON.stringify({ error: "Invalid projectId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (spaceKey.length > 100 || !/^[a-z0-9-]+$/i.test(spaceKey)) {
      return new Response(JSON.stringify({ error: "Invalid spaceKey" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // AUTHORIZATION: caller must be either a team member OR pass an access_token matching the project.
    let authorized = false;

    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const jwt = authHeader.replace("Bearer ", "");
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: userData } = await anonClient.auth.getUser(jwt);
      if (userData?.user) {
        const { data: tm } = await serviceClient
          .from("team_members")
          .select("id")
          .eq("user_id", userData.user.id)
          .maybeSingle();
        if (tm) authorized = true;
      }
    }

    if (!authorized && accessToken && UUID_RE.test(accessToken)) {
      const { data: proj } = await serviceClient
        .from("projects")
        .select("id")
        .eq("id", projectId)
        .eq("access_token", accessToken)
        .maybeSingle();
      if (proj) authorized = true;
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
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

    const externalId = `${projectId}-${spaceKey}-${Date.now()}`;
    const webhookSecret = Deno.env.get("CUBICASA_WEBHOOK_SECRET");
    const webhookUrl = webhookSecret
      ? `${supabaseUrl}/functions/v1/cubicasa-webhook?secret=${encodeURIComponent(webhookSecret)}`
      : `${supabaseUrl}/functions/v1/cubicasa-webhook`;

    const params = new URLSearchParams({
      token: typeof goToScanToken === "string" ? goToScanToken : JSON.stringify(goToScanToken),
      conversion_type: "t3",
      external_id: externalId,
      webhook_url: webhookUrl,
      priority: "fast",
    });

    const scanLink = `https://gotoscan.io/scan/?${params.toString()}`;

    const { error: updateError } = await serviceClient
      .from("spaces")
      .update({ scan_status: "pending", scan_link: scanLink })
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
