import Image from "next/image";

import { PhotoCredit } from "@/components/app/photo-credit";
import { HERO_SEARCH_ID } from "@/components/layout/site-header";
import { SearchPill, type DestinationOption } from "@/components/search/search-pill";

/** Full-bleed rounded photo with EXPLORE and the search pill, as on the original home page. */
export function Hero({ destinations }: { destinations: DestinationOption[] }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex h-[calc(100dvh-5.5rem)] min-h-[34rem] flex-col px-4 pb-10 sm:px-8 sm:pb-16"
    >
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border">
        <Image
          src="/images/hero-section.jpg"
          alt="An aerial view of the coastal town of El Nido in the Philippines"
          fill
          priority
          // Next preloads a priority image but doesn't mark it high priority; without this the
          // browser discovers the LCP image late.
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        {/* Flat scrim so the light EXPLORE and the pill read clearly. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
        <div className="relative flex w-full flex-col items-center gap-2 px-4 sm:-mt-12">
          <h1
            id="hero-title"
            className="title text-[6.5rem] font-semibold text-hero-title select-none sm:-mb-6 sm:text-[9.5rem]"
          >
            Explore
          </h1>
          <div id={HERO_SEARCH_ID} className="w-full max-w-md lg:max-w-none">
            <SearchPill destinations={destinations} className="mx-auto hidden w-fit lg:flex" />
            <SearchPill variant="compact" destinations={destinations} className="lg:hidden" />
          </div>
        </div>
        <PhotoCredit
          name="Eibner Saliba"
          url="https://unsplash.com/@zilch?utm_source=trailventure&utm_medium=referral"
          tone="overlay"
          className="absolute right-4 bottom-4"
        />
      </div>
    </section>
  );
}
