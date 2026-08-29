/**
 * Cloudflare Worker entry point.
 *
 * The curriculum is a client-side application backed by static assets, so this
 * Worker deliberately does almost nothing: Cloudflare serves matching assets
 * from the edge before the Worker ever runs, and requests that don't match an
 * asset land here.
 *
 * It exists as the deployment target (Workers Static Assets) and as the seam
 * where server-side functionality would go later — e.g. progress sync — without
 * changing the deployment architecture. There is no backend today by design.
 */

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Reserve /api/* for future server-side functionality. Nothing is
    // implemented yet, so answer honestly rather than falling through to the
    // SPA shell (which would return HTML to an API client).
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return Response.json(
        { error: "Not implemented", detail: "This build has no server-side API." },
        { status: 501 },
      );
    }

    // Everything else: hand back to static assets, which applies
    // not_found_handling: "single-page-application" for unknown paths.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
