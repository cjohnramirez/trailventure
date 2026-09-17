import { NextResponse, type NextRequest } from "next/server";

/**
 * UX-only gate: send visitors without a session cookie to login before rendering private pages.
 * Django enforces the real authorization on every API call.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has("sessionid")) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/account/:path*"],
};
