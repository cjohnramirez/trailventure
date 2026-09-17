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
  images: {
    // Unsplash photos are resized on Unsplash's CDN (hotlinking is required by its API terms).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
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
