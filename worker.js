export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Apple requires the AASA file to be served as application/json.
    // Cloudflare Workers Assets serves extensionless files as application/octet-stream,
    // so we intercept and set the correct Content-Type here.
    if (url.pathname === "/.well-known/apple-app-site-association") {
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.set("Content-Type", "application/json");
      headers.set("Cache-Control", "max-age=3600, s-maxage=3600");
      return new Response(response.body, { status: response.status, headers });
    }

    return env.ASSETS.fetch(request);
  },
};
