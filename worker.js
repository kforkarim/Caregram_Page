// AASA served inline so it's always in sync with deployments.
// Cloudflare Workers uploads dotfile directories as assets, so we must:
// 1. Serve AASA inline (not from assets) to prevent stale file serving.
// 2. Block /.git and /.wrangler to prevent accidental credential exposure.
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

    // Block sensitive dotfile directories uploaded as assets.
    if (url.pathname.startsWith("/.git/") || url.pathname.startsWith("/.wrangler/")) {
      return new Response("Not Found", { status: 404 });
    }

    // Apple requires the AASA file served as application/json.
    // No s-maxage so Cloudflare CDN doesn't cache it; max-age lets Apple's
    // CDN cache for 1h as usual.
    if (url.pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=3600"
        }
      });
    }

    return env.ASSETS.fetch(request);
  },
};
