import { toIsoDate } from "./format";

export const PRICE_STEP = 500;
export const PRICE_MAX = 100_000;

export type SearchCriteria = {
  destination?: string;
  from?: Date;
  to?: Date;
  minPrice?: number;
  maxPrice?: number;
};

/** Builds /search?… from the search pill's criteria, omitting empty filters. */
export function buildSearchHref(criteria: SearchCriteria): string {
  const params = new URLSearchParams();
  if (criteria.destination) params.set("destination", criteria.destination);
  if (criteria.from) params.set("start", toIsoDate(criteria.from));
  if (criteria.to) params.set("end", toIsoDate(criteria.to));
  if (criteria.minPrice) params.set("min_price", String(criteria.minPrice));
  if (criteria.maxPrice !== undefined && criteria.maxPrice < PRICE_MAX) {
    params.set("max_price", String(criteria.maxPrice));
  }
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}
