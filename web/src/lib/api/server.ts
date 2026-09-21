import "server-only";

/**
 * Server-side reads from the Django API (Server Components, metadata, sitemaps).
 * Public catalog data is cached by Next.js for a few minutes and tagged for revalidation.
 */

const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:8000";

export class ApiUnavailableError extends Error {
  constructor(
    readonly path: string,
    readonly status?: number,
  ) {
    super(`API request failed: ${path}${status ? ` (${status})` : ""}`);
    this.name = "ApiUnavailableError";
  }
}

type ServerGetOptions = { revalidate?: number; tags?: string[] };

/** GET JSON from the API. Returns `null` on 404; throws ApiUnavailableError otherwise. */
export async function apiGet<T>(
  path: string,
  { revalidate = 300, tags = [] }: ServerGetOptions = {},
): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${API_ORIGIN}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate, tags },
    });
  } catch {
    throw new ApiUnavailableError(path);
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new ApiUnavailableError(path, response.status);
  return (await response.json()) as T;
}
