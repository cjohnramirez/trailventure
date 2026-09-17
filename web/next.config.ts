import path from "node:path";

import type { NextConfig } from "next";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // Minimal self-contained server for the Railway Docker image.
  output: "standalone",
  // Pin file tracing and Turbopack to this package, not the monorepo root.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  poweredByHeader: false,
  // Django URLs end in a slash; don't let Next strip it before proxying.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // Same-origin proxy so Django session and CSRF cookies stay first-party.
    // `:path*` drops a trailing slash, and Django's URLs need it (otherwise APPEND_SLASH redirects
    // back through this proxy forever), so slash-terminated paths get their own rule first.
    const proxied = ["api", "_allauth", "django-admin", "accounts", "static"];
    return proxied.flatMap((prefix) => [
      { source: `/${prefix}/:path*/`, destination: `${apiOrigin}/${prefix}/:path*/` },
      { source: `/${prefix}/:path*`, destination: `${apiOrigin}/${prefix}/:path*` },
    ]);
  },
};

export default nextConfig;
