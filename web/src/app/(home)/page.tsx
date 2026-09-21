import { Suspense } from "react";

import { ErrorState } from "@/components/app/error-state";
import { SectionHeading } from "@/components/app/section-heading";
import { ChooseUs } from "@/components/home/choose-us";
import { DestinationBento, isTall } from "@/components/home/destination-bento";
import { Hero } from "@/components/home/hero";
import { Skeleton } from "@/components/ui/skeleton";
import { getDestinations } from "@/lib/catalog/api";

/**
 * Rendered per request rather than prerendered. The image is built where the API isn't reachable
 * (Railway builds before the service is wired up), and a prerendered home page would ship the
 * "couldn't load destinations" state baked in. Django caches these reads in Redis, so the cost of
 * rendering on demand is small.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destinations = await getDestinations().catch(() => []);
  return (
    <>
      <Hero destinations={destinations} />
      <section aria-labelledby="featured-title" className="px-4 pt-6 pb-8 sm:px-8">
        <SectionHeading
          id="featured-title"
          title="Featured Destinations"
          subtitle="Choose your next travel destination"
        />
        <Suspense fallback={<BentoSkeleton />}>
          <FeaturedDestinations />
        </Suspense>
      </section>
      <ChooseUs />
    </>
  );
}

async function FeaturedDestinations() {
  const featured = await getDestinations({ featured: true }).catch(() => null);
  if (featured === null) {
    return (
      <div className="mx-auto max-w-[75rem]">
        <ErrorState
          title="We couldn’t load destinations"
          description="Featured destinations are unavailable right now. Try again in a moment."
        />
      </div>
    );
  }
  // With nothing to feature, the section shows no tiles rather than an empty frame.
  if (featured.length === 0) return null;
  return <DestinationBento destinations={featured} />;
}

function BentoSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading destinations"
      className="mx-auto grid max-w-[75rem] auto-rows-[13rem] grid-cols-2 gap-4 md:auto-rows-[15rem] lg:grid-cols-4"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton
          key={index}
          className={isTall(index) ? "row-span-2 rounded-2xl" : "rounded-2xl"}
        />
      ))}
    </div>
  );
}
