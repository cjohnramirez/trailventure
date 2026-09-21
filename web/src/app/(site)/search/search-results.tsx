import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";

import { ErrorState } from "@/components/app/error-state";
import { PackageCard, PackageCardSkeleton } from "@/components/catalog/package-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { searchPackages } from "@/lib/catalog/api";
import { hasActiveFilters, toSearchQuery, type SearchFilters } from "@/lib/catalog/search-params";

function ResultsHeader({ count }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="type-heading">Search Results</h1>
      <Badge variant="outline" className="h-8 rounded-full px-3 type-ui" aria-live="polite">
        {count === undefined
          ? "Searching…"
          : `Found ${count} ${count === 1 ? "package" : "packages"}`}
      </Badge>
    </div>
  );
}

export async function SearchResults({ filters }: { filters: SearchFilters }) {
  const page = await searchPackages(filters).catch(() => undefined);

  if (!page) {
    return (
      <div className="flex flex-col gap-6">
        <ResultsHeader />
        <ErrorState
          title="We couldn’t load packages"
          description="Search is unavailable right now. Try again in a moment."
        />
      </div>
    );
  }

  if (page.count === 0) {
    return (
      <div className="flex flex-col gap-6">
        <ResultsHeader count={0} />
        <Empty className="rounded-2xl border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>No packages found matching your filters</EmptyTitle>
            <EmptyDescription>
              Try a different destination or date range, or widen your budget.
            </EmptyDescription>
          </EmptyHeader>
          {hasActiveFilters(filters) ? (
            <EmptyContent>
              <Button asChild variant="outline">
                <Link href="/search">Clear filters</Link>
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      </div>
    );
  }

  const pageHref = (target: number) => {
    const query = toSearchQuery({ ...filters, page: target });
    return query ? `/search?${query}` : "/search";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResultsHeader count={page.count} />
        {page.total_pages > 1 ? (
          <nav aria-label="Pagination" className="flex items-center gap-2">
            {page.page > 1 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={pageHref(page.page - 1)} scroll={false}>
                  <ChevronLeftIcon data-icon="inline-start" />
                  Previous
                </Link>
              </Button>
            ) : null}
            <span className="px-2 type-ui tabular-nums" aria-current="page">
              Page {page.page} of {page.total_pages}
            </span>
            {page.page < page.total_pages ? (
              <Button asChild variant="outline" size="sm">
                <Link href={pageHref(page.page + 1)} scroll={false}>
                  Next
                  <ChevronRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            ) : null}
          </nav>
        ) : null}
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {page.results.map((pkg) => (
          <li key={pkg.slug}>
            <PackageCard pkg={pkg} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading packages">
      <ResultsHeader />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
