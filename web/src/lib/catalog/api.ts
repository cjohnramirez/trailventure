import "server-only";

import { apiGet } from "@/lib/api/server";

import { toSearchQuery, type SearchFilters } from "./search-params";
import type { Destination, PackageDetail, PackagePage } from "./types";

export const CATALOG_TAG = "catalog";

export async function getDestinations({ featured = false } = {}) {
  const query = featured ? "?featured=true" : "";
  return (
    (await apiGet<Destination[]>(`/api/v1/destinations/${query}`, { tags: [CATALOG_TAG] })) ?? []
  );
}

export async function searchPackages(filters: SearchFilters) {
  const query = toSearchQuery(filters);
  return apiGet<PackagePage>(`/api/v1/packages/${query ? `?${query}` : ""}`, {
    tags: [CATALOG_TAG],
    revalidate: 120,
  });
}

export async function getPackage(slug: string) {
  return apiGet<PackageDetail>(`/api/v1/packages/${encodeURIComponent(slug)}/`, {
    tags: [CATALOG_TAG, `package:${slug}`],
  });
}
