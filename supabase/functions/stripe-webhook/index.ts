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

function buildEmailHtml(clientName: string, spaces: SpaceItem[], dashboardUrl: string): string {
  const spacesList = spaces
    .map((s) => `<li style="padding:4px 0;font-size:15px;color:#333;">${s.name} — ${s.size}${s.render3d ? ' (+ 3D Render)' : ''}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
  <!-- Header -->
  <tr><td style="background-color:#1e3a5f;padding:32px 40px;text-align:center;">
    <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;letter-spacing:0.5px;">MEASURED</h1>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:40px;">
    <p style="font-size:16px;color:#333;margin:0 0 20px;">Hi ${clientName},</p>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">
      Thank you — your payment has been received and your project is now set up! Here's what you ordered:
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;">${spacesList}</ul>
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 28px;">
      Your personal dashboard is ready. Click below to get started by submitting your project brief:
    </p>
    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="${dashboardUrl}" target="_blank"
         style="display:inline-block;background-color:#c1440e;color:#ffffff;font-size:16px;font-weight:600;
                padding:14px 36px;border-radius:6px;text-decoration:none;">
        Go to My Dashboard
      </a>
    </td></tr></table>
    <p style="font-size:14px;color:#666;line-height:1.6;margin:28px 0 0;">
      Your first draft will be ready within <strong>7 business days</strong>. We'll notify you as soon as it's available for review.
    </p>
  </td></tr>
  <!-- Footer -->
  <tr><td style="background-color:#1e3a5f;padding:24px 40px;text-align:center;">
    <p style="margin:0;font-size:13px;color:#a0b4c8;">© ${new Date().getFullYear()} Measured. All rights reserved.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
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

      // Send confirmation email via Resend
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        const dashboardUrl = `https://millwork-maker-pro.lovable.app/dashboard?token=${accessToken}`;
        const htmlBody = buildEmailHtml(clientName, spaces, dashboardUrl);

        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Measured <onboarding@resend.dev>",
              to: [clientEmail],
              subject: "Your Measured project is ready — here's your link",
              html: htmlBody,
            }),
          });

          if (!emailRes.ok) {
            const errBody = await emailRes.text();
            console.error(`Resend email failed [${emailRes.status}]: ${errBody}`);
          } else {
            console.log(`Confirmation email sent to ${clientEmail}`);
          }
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
        }
      } else {
        console.warn("RESEND_API_KEY not set, skipping confirmation email");
      }
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
