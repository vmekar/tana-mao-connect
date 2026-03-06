import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  name: string;
  verificationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, verificationUrl }: VerificationEmailRequest = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TemRolo <onboarding@resend.dev>",
        to: [email],
        subject: "Verifique sua conta no TemRolo",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
              <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 32px;">
                  <span style="font-size: 48px;">🤝</span>
                  <h1 style="color: #7c3aed; margin: 16px 0 0; font-size: 28px;">TemRolo</h1>
                </div>
                
                <h2 style="color: #18181b; font-size: 20px; margin-bottom: 16px;">
                  Olá${name ? `, ${name}` : ''}!
                </h2>
                
                <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                  Obrigado por se cadastrar no TemRolo! Para ativar sua conta e começar a ajudar ou receber ajuda, clique no botão abaixo:
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #14b8a6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Verificar minha conta
                  </a>
                </div>
                
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-top: 32px;">
                  Se você não criou uma conta no TemRolo, pode ignorar este email com segurança.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
                
                <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} TemRolo. Conectando quem precisa com quem pode ajudar.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Verification email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
