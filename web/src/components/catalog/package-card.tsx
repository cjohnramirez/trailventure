import { ImageIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";

import { CatalogImage } from "@/components/app/catalog-image";
import { Rating } from "@/components/catalog/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCentavos } from "@/lib/format";
import type { PackageCard as PackageCardData } from "@/lib/catalog/types";

/** The original search result card: photo on top, an inner box with name, summary and price. */
export function PackageCard({ pkg }: { pkg: PackageCardData }) {
  return (
    <article className="h-full">
      <Link
        href={`/package/${pkg.slug}`}
        className="group flex h-full flex-col gap-3 rounded-2xl border p-3 outline-none hover:border-brand-hover focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
          {pkg.cover ? (
            <CatalogImage
              src={pkg.cover.url}
              alt={pkg.cover.alt}
              fill
              sizes="(min-width: 1280px) 22rem, (min-width: 768px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon aria-hidden="true" className="size-6 text-muted-foreground/60" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 rounded-xl border p-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="line-clamp-2 type-card-title">{pkg.name}</h2>
            <p className="inline-flex items-center gap-1.5 type-ui text-muted-foreground">
              <MapPinIcon aria-hidden="true" className="size-4.5 shrink-0" />
              <span className="truncate">
                {pkg.destination.name}, {pkg.destination.country}
              </span>
            </p>
            <p className="line-clamp-2 type-ui text-muted-foreground">{pkg.description}</p>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
            <Rating average={pkg.rating_avg} count={pkg.rating_count} />
            <p className="type-ui text-muted-foreground">
              from{" "}
              <span className="type-body font-semibold text-foreground tabular-nums">
                {formatCentavos(pkg.min_price)}
              </span>{" "}
              / person
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-3">
      <Skeleton className="aspect-[16/10] rounded-xl" />
      <div className="flex flex-col gap-3 rounded-xl border p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  );
}
