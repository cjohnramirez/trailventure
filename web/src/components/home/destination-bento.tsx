import { MapPinIcon } from "lucide-react";
import Link from "next/link";

import { CatalogImage } from "@/components/app/catalog-image";
import type { Destination } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

function tripCount(count: number) {
  if (count === 0) return "No trips yet";
  return `${count} ${count === 1 ? "trip" : "trips"}`;
}

/** As on the original home page, only the 1st and 3rd tiles span two rows. */
export function isTall(index: number) {
  return index === 0 || index === 2;
}

/**
 * The original "bento" grid: the 1st and 3rd tiles span two rows, and each photo carries a
 * floating label with the destination name, region and trip count.
 */
export function DestinationBento({ destinations }: { destinations: Destination[] }) {
  return (
    <ul className="mx-auto grid max-w-[75rem] auto-rows-[13rem] grid-cols-2 gap-4 md:auto-rows-[15rem] lg:grid-cols-4">
      {destinations.map((destination, index) => (
        <li key={destination.slug} className={cn(isTall(index) && "row-span-2")}>
          <Link
            href={`/search?destination=${destination.slug}`}
            className="group relative flex h-full overflow-hidden rounded-2xl border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <CatalogImage
              src={destination.photo.url}
              alt={destination.photo.alt}
              fill
              // `sizes` describes width, but a tall tile is roughly twice as high as it is
              // wide and these photos are landscape, so `object-cover` scales them to fit the
              // height. Asking for the tile's width alone would fetch something half the size
              // it gets drawn at, which is visibly soft.
              sizes={
                isTall(index)
                  ? "(min-width: 1024px) 36rem, 50vw"
                  : "(min-width: 1024px) 18rem, 50vw"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border bg-background px-4 py-3">
              <MapPinIcon aria-hidden="true" className="size-4.5 shrink-0" />
              <div className="min-w-0">
                <p className="truncate type-body font-semibold">{destination.name}</p>
                <p className="truncate type-ui text-muted-foreground">
                  {destination.region} · {tripCount(destination.package_count)}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
