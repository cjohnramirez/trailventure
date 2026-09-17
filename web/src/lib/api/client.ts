/**
 * Browser-side fetch helpers for the same-origin Django API (proxied by Next.js rewrites).
 * Session and CSRF cookies are first-party, so requests just include credentials and echo the
 * CSRF token in a header on unsafe methods.
 */

const CSRF_COOKIE = "csrftoken";

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/** Ensures a CSRF cookie exists; allauth's config endpoint sets one. */
export async function ensureCsrfToken(): Promise<string> {
  const existing = readCookie(CSRF_COOKIE);
  if (existing) return existing;
  await fetch("/_allauth/browser/v1/config", { credentials: "include" });
  const token = readCookie(CSRF_COOKIE);
  if (!token) throw new ApiError("Couldn’t start a secure session. Refresh and try again.", 0);
  return token;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { json?: unknown };

/** fetch with credentials, JSON body and CSRF header. Never throws on HTTP status. */
export async function apiRequest(
  path: string,
  { json, headers, method = "GET", ...init }: RequestOptions = {},
) {
  const unsafe = !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (json !== undefined) finalHeaders.set("Content-Type", "application/json");
  if (unsafe) finalHeaders.set("X-CSRFToken", await ensureCsrfToken());

  try {
    return await fetch(path, {
      ...init,
      method,
      credentials: "include",
      headers: finalHeaders,
      body: json === undefined ? undefined : JSON.stringify(json),
    });
  } catch {
    throw new ApiError("We couldn’t reach TrailVenture. Check your connection and try again.", 0);
  }
}
