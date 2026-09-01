// AASA is served by the caregram-aasa Worker (routes: /.well-known/... and /epic/*).
// This Worker handles the static marketing site assets.
// .git and .wrangler are blocked here as defense-in-depth even though .assetsignore
// also excludes them from the asset manifest.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/.git/") || url.pathname.startsWith("/.wrangler/")) {
      return new Response("Not Found", { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
