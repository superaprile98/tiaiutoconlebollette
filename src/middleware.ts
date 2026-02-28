import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  
  // 1. Redirect dal dominio .com (con o senza www) al .it con www
  if (hostname.includes("tiaiutoconlebollette.com")) {
    url.hostname = "www.tiaiutoconlebollette.it";
    return context.redirect(url.toString(), 301);
  }

  // 2. Forza il www sul dominio .it principale (es. tiaiutoconlebollette.it -> www.tiaiutoconlebollette.it)
  if (hostname === "tiaiutoconlebollette.it") {
    url.hostname = "www.tiaiutoconlebollette.it";
    return context.redirect(url.toString(), 301);
  }

  return next();
});
