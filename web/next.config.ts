import type { NextConfig } from "next";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // Django URLs end in a slash; don't let Next strip it before proxying.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // Same-origin proxy so Django session and CSRF cookies stay first-party.
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/_allauth/:path*", destination: `${apiOrigin}/_allauth/:path*` },
    ];
  },
};

export default nextConfig;
