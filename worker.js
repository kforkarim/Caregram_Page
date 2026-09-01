// AASA served inline so it's always in sync with deployments.
// Cloudflare Workers excludes dotfile directories (.well-known/) from asset
// uploads, so the file-based approach silently served a stale cached version.
const AASA = JSON.stringify({
  applinks: {
    details: [{
      appIDs: ["57C85XZ235.com.caregram.Caregram"],
      components: [{ "/": "/epic/callback*" }]
    }]
  },
  webcredentials: {
    apps: ["57C85XZ235.com.caregram.Caregram"]
  }
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Apple requires the AASA file to be served as application/json.
    // Embedded inline so changes deploy atomically with worker.js.
    if (url.pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=3600, s-maxage=3600"
        }
      });
    }

    return env.ASSETS.fetch(request);
  },
};
