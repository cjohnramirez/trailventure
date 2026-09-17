import path from "node:path";

import type { NextConfig } from "next";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // Minimal self-contained server for the Railway Docker image.
  output: "standalone",
  // The repo root also holds a lockfile (legacy app); pin tracing to this package.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  poweredByHeader: false,
  // Django URLs end in a slash; don't let Next strip it before proxying.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // Same-origin proxy so Django session and CSRF cookies stay first-party.
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/_allauth/:path*", destination: `${apiOrigin}/_allauth/:path*` },
      { source: "/django-admin/:path*", destination: `${apiOrigin}/django-admin/:path*` },
      { source: "/static/:path*", destination: `${apiOrigin}/static/:path*` },
    ];
  },
};

export default nextConfig;
