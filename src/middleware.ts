import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  
  // Se l'utente accede tramite il dominio .com (con o senza www)
  if (url.hostname.includes("tiaiutoconlebollette.com")) {
    // Forza il redirect verso la versione principale .it con www
    url.hostname = "www.tiaiutoconlebollette.it";
    
    // Ritorna un redirect 301 (Permanente). 
    // Mantiene anche il percorso (es. .com/contatti -> .it/contatti)
    return context.redirect(url.toString(), 301);
  }

  // Altrimenti procedi normalmente con la richiesta
  return next();
});
