import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request, locals }) => {
  const data = await request.formData();
  const nome = data.get("name")?.toString();
  const mail = data.get("contact")?.toString();
  const messaggio = data.get("message")?.toString();

  if (!nome || !mail || !messaggio) {
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
      from: "onboarding@resend.dev",
      to: ["baugigi@proton.me"],
      replyTo: mail, // Resend lo accetta, ma deve essere in un formato verosimile "email@email.com" - il from name si usa <Name> email@email.com, non per il replyTo
      subject: `Nuovo mail dal sito web da: ${nome}`,
      text: `Nuovo Messaggio dal sito web.\n\nNome: ${nome}\nmail (Tel o Email): ${mail}\n\nMessaggio:\n${messaggio}`,
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
