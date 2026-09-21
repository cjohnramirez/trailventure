import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal self-contained server for the Railway Docker image.
  output: "standalone",
  // Pin file tracing and Turbopack to this package, not the monorepo root.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  poweredByHeader: false,
  // Django URLs end in a slash; don't let Next strip it before proxying (see src/proxy.ts, which
  // forwards Django's paths at request time rather than baking a destination into the build).
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
