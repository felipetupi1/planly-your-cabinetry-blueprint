import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_MAP: Record<string, string> = {
  "Kitchen-small": "price_1TAExv2Y3oH19O8usOYFuf5R",
  "Kitchen-medium": "price_1TAEyC2Y3oH19O8uK4WGTcdy",
  "Kitchen-large": "price_1TAEya2Y3oH19O8u8gcP5MMZ",
  "Closet-small": "price_1TAEyt2Y3oH19O8uZbFOzgUx",
  "Closet-medium": "price_1TAEzK2Y3oH19O8uu6pRXlzB",
  "Closet-large": "price_1TAFEd2Y3oH19O8u95UFyvMr",
  "Bathroom-small": "price_1TAEzg2Y3oH19O8uv1g77IQV",
  "Bathroom-medium": "price_1TAFF12Y3oH19O8u1qXjZS0r",
  "Bathroom-large": "price_1TAFFS2Y3oH19O8uo12EzL1T",
  "Pantry-small": "price_1TAFFq2Y3oH19O8uZB0BLVKn",
  "Pantry-medium": "price_1TAFGI2Y3oH19O8uuIlFbtPZ",
  "Pantry-large": "price_1TAFGg2Y3oH19O8uag0wdAB4",
};

const RENDER_PRICE = "price_1TAF0m2Y3oH19O8uQImUTnXT";

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

    const { spaces, clientName, clientEmail, originUrl } = await req.json() as {
      spaces: SpaceItem[];
      clientName: string;
      clientEmail: string;
      originUrl: string;
    };

    if (!spaces?.length || !clientName || !clientEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const space of spaces) {
      const key = `${space.name}-${space.size}`;
      const priceId = PRICE_MAP[key];
      if (!priceId) {
        return new Response(JSON.stringify({ error: `No price found for ${key}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      lineItems.push({ price: priceId, quantity: 1 });

      if (space.render3d) {
        lineItems.push({ price: RENDER_PRICE, quantity: 1 });
      }
    }

    // Pre-generate access token
    const accessToken = crypto.randomUUID();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: clientEmail,
      success_url: `${originUrl}/dashboard?token=${accessToken}`,
      cancel_url: originUrl,
      metadata: {
        client_name: clientName,
        client_email: clientEmail,
        access_token: accessToken,
        spaces_json: JSON.stringify(spaces),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
