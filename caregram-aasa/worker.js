// Cloudflare Worker: caregram-aasa
// Routes: caregram.co/.well-known/apple-app-site-association
//         caregram.co/epic/*
//
// Handles AASA (for Associated Domains / ASWebAuthenticationSession) and the
// Epic OAuth callback redirect.
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/.well-known/apple-app-site-association") {
      return new Response(JSON.stringify({
        applinks: {
          details: [{
            appIDs: ["57C85XZ235.com.caregram.Caregram"],
            components: [{ "/": "/epic/callback*" }]
          }]
        },
        webcredentials: {
          apps: ["57C85XZ235.com.caregram.Caregram"]
        }
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=3600"
        }
      });
    }

    if (url.pathname.startsWith("/epic/callback")) {
      const target = "caregram://callback" + url.search;
      return new Response(
        `<!DOCTYPE html><html><head><script>window.location.replace(${JSON.stringify(target)})</script></head><body></body></html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return new Response("Not found", { status: 404 });
  }
};
