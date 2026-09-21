import "server-only";

import { apiGet } from "@/lib/api/server";
import { CATALOG_TAG } from "@/lib/catalog/api";

import type { Review } from "./types";

/** Reviews for the package page. Tagged with the catalog so a new review revalidates the page. */
export async function getPackageReviews(slug: string): Promise<Review[]> {
  return (
    (await apiGet<Review[]>(`/api/v1/packages/${encodeURIComponent(slug)}/reviews/`, {
      tags: [CATALOG_TAG, `package:${slug}`],
      revalidate: 120,
    })) ?? []
  );
}
