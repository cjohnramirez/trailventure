import { NextResponse, type NextRequest } from "next/server";

/**
 * Paths that belong to Django. Forwarding them from this origin is what keeps the session and
 * CSRF cookies first-party, so no auth token ever has to live in `localStorage`.
 */
const API_PREFIXES = ["/api", "/_allauth", "/django-admin", "/accounts", "/static"];

/** Private pages. The gate is for UX only; Django enforces the real authorization. */
const PRIVATE_PREFIXES = ["/account", "/booking"];

function startsWithSegment(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (API_PREFIXES.some((prefix) => startsWithSegment(pathname, prefix))) {
    // Resolved per request, not at build time: the same image has to work in every environment,
    // and Railway supplies the API's private address as a runtime variable. Next's `rewrites()`
    // would bake whatever the build machine happened to have into routes-manifest.json.
    const origin = process.env.API_ORIGIN ?? "http://localhost:8000";
    // Django's URLs end in a slash, so the path is forwarded exactly as it arrived.
    return NextResponse.rewrite(new URL(`${pathname}${search}`, origin));
  }

  if (PRIVATE_PREFIXES.some((prefix) => startsWithSegment(pathname, prefix))) {
    if (request.cookies.has("sessionid")) return NextResponse.next();
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/_allauth/:path*",
    "/django-admin/:path*",
    "/accounts/:path*",
    "/static/:path*",
    "/account/:path*",
    "/booking/:path*",
  ],
};
