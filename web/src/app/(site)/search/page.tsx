import type { Metadata } from "next";
import { Suspense } from "react";

import { getDestinations } from "@/lib/catalog/api";
import { parseSearchFilters, toSearchQuery } from "@/lib/catalog/search-params";

import { SearchFilters } from "./search-filters";
import { SearchResults, SearchResultsSkeleton } from "./search-results";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const filters = parseSearchFilters(await searchParams);
  const destination = filters.destination
    ? (await getDestinations().catch(() => [])).find((item) => item.slug === filters.destination)
    : undefined;
  const title = destination ? `Tour packages in ${destination.name}` : "Search tour packages";
  return {
    title,
    description: destination
      ? `Compare tour packages in ${destination.name}, ${destination.country}, by date, budget and review score.`
      : "Search tour packages by destination, dates, budget and review score.",
    alternates: { canonical: destination ? `/search?destination=${destination.slug}` : "/search" },
  };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const filters = parseSearchFilters(await searchParams);
  const destinations = await getDestinations().catch(() => []);

  return (
    <div className="mx-auto grid w-full max-w-screen-2xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8">
      <SearchFilters
        // Remount the form when the URL changes so it reflects the applied filters.
        key={toSearchQuery({ ...filters, page: undefined })}
        filters={filters}
        destinations={destinations.map(({ slug, name, region, country }) => ({
          slug,
          name,
          region,
          country,
        }))}
      />
      <section aria-label="Results" className="min-w-0">
        <Suspense key={toSearchQuery(filters)} fallback={<SearchResultsSkeleton />}>
          <SearchResults filters={filters} />
        </Suspense>
      </section>
    </div>
  );
}
