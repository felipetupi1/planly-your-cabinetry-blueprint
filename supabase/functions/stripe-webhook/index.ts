import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SpaceItem {
  name: string;
  size: string;
  price: number;
  render3d: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("Stripe_secret_key")!, {
      apiVersion: "2025-04-30.basil",
    });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (webhookSecret && sig) {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};

      const clientName = meta.client_name;
      const clientEmail = meta.client_email;
      const accessToken = meta.access_token;
      const spacesJson = meta.spaces_json;

      if (!clientName || !clientEmail || !accessToken || !spacesJson) {
        console.error("Missing metadata in checkout session");
        return new Response(JSON.stringify({ error: "Missing metadata" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const spaces: SpaceItem[] = JSON.parse(spacesJson);

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          client_name: clientName,
          client_email: clientEmail,
          access_token: accessToken,
          stage: "Brief",
          stripe_session_id: session.id,
        })
        .select("id")
        .single();

      if (projectError) {
        console.error("Project insert error:", projectError);
        return new Response(JSON.stringify({ error: projectError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create spaces
      const spaceRows = spaces.map((s) => ({
        project_id: project.id,
        space_key: s.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        space_label: s.name,
        size: s.size,
        price: s.price,
        render_3d: s.render3d,
      }));

      const { error: spacesError } = await supabase
        .from("spaces")
        .insert(spaceRows);

      if (spacesError) {
        console.error("Spaces insert error:", spacesError);
      }

      console.log(`Project ${project.id} created for ${clientEmail}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
