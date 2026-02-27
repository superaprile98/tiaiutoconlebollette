import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request, locals }) => {
  const data = await request.formData();
  const nome = data.get("name")?.toString();
  const mail = data.get("contact")?.toString();
  const subject = data.get("subject")?.toString();
  const messaggio = data.get("message")?.toString();

  if (!nome || !mail || !subject || !messaggio) {
    return new Response(
      JSON.stringify({
        message: "Campi mancanti.",
      }),
      { status: 400 }
    );
  }

  // Supporto locale (import.meta.env) e produzione Cloudflare (locals.runtime.env)
  const runtime = (locals as any).runtime;
  const apiKey = import.meta.env.RESEND_API_KEY || runtime?.env?.RESEND_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        message: "API Key mancante dal server.",
      }),
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
  // 1. Cambia il mittente! Non usare più onboarding@resend.dev
  from: "Ti aiuto con le bollette <contatti@tiaiutoconlebollette.it>", 
  
  // 2. Ora questo funzionerà senza problemi
  to: ["info@tiaiutoconlebollette.it"], 
  
  replyTo: mail,
  subject: `Richiesta ${subject} da ${mail}`,
  text: `${messaggio}\n\n---\nNome: ${nome}\nMail: ${mail}`,
});

    if (error) {
      return new Response(
        JSON.stringify({
          message: error.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Email inviata correttamente!",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Errore imprevisto lato server.",
      }),
      { status: 500 }
    );
  }
};
