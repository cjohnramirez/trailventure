/** Search filters as they appear in the /search URL (prices in whole pesos). */
export type SearchFilters = {
  destination?: string;
  start?: string;
  end?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  page?: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInt(value: string | undefined, max: number): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return parsed >= 0 && parsed <= max ? parsed : undefined;
}

/** Parses untrusted URL params, dropping anything malformed instead of erroring. */
export function parseSearchFilters(raw: RawParams): SearchFilters {
  const destination = first(raw.destination);
  const start = first(raw.start);
  const end = first(raw.end);
  const rating = positiveInt(first(raw.rating), 5);
  const page = positiveInt(first(raw.page), 10_000);
  return {
    destination: destination && /^[a-z0-9-]+$/.test(destination) ? destination : undefined,
    start: start && ISO_DATE.test(start) ? start : undefined,
    end: end && ISO_DATE.test(end) ? end : undefined,
    min_price: positiveInt(first(raw.min_price), 10_000_000),
    max_price: positiveInt(first(raw.max_price), 10_000_000),
    rating: rating && rating >= 1 ? rating : undefined,
    page: page && page >= 1 ? page : undefined,
  };
}

/** Serializes filters to a query string, omitting empty values and page 1. */
export function toSearchQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "" || (key === "page" && value === 1)) continue;
    params.set(key, String(value));
  }
  return params.toString();
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Object.entries(filters).some(([key, value]) => key !== "page" && value !== undefined);
}
