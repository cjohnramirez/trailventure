import { SlotPhoto } from "@/components/app/slot-photo";
import { HERO_SEARCH_ID } from "@/components/layout/site-header";
import { SearchPill, type DestinationOption } from "@/components/search/search-pill";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Full-bleed rounded photo with EXPLORE and the search pill, as on the original home page.
 * Light mode: a darkened photo under light EXPLORE. Dark mode: a naturally light photo under
 * off-black EXPLORE (the original dark-mode treatment). Without photos, placeholders show.
 */
export function Hero({ destinations }: { destinations: DestinationOption[] }) {
  const hasPhotos = Boolean(photos.hero.src && photos.heroDark.src);
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex h-[calc(100dvh-5.5rem)] min-h-[34rem] flex-col px-4 pb-10 sm:px-8 sm:pb-16"
    >
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 dark:hidden">
          <SlotPhoto
            photo={photos.hero}
            sizes="100vw"
            priority
            placeholderIconClassName="absolute right-5 bottom-5"
          />
          {photos.hero.src ? (
            // Flat scrim so light EXPLORE and the pill read clearly.
            <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
          ) : null}
        </div>
        <div className="absolute inset-0 hidden dark:block">
          <SlotPhoto
            photo={photos.heroDark}
            sizes="100vw"
            placeholderIconClassName="absolute right-5 bottom-5"
          />
        </div>
        <div className="relative flex w-full flex-col items-center gap-4 px-4 sm:-mt-12">
          <h1
            id="hero-title"
            className={cn(
              "title text-[6.5rem] font-semibold select-none sm:-mb-6 sm:text-[9.5rem]",
              hasPhotos ? "text-hero-title" : "text-foreground",
            )}
          >
            Explore
          </h1>
          <div id={HERO_SEARCH_ID} className="w-full max-w-md lg:max-w-none">
            <SearchPill destinations={destinations} className="mx-auto hidden w-fit lg:flex" />
            <SearchPill variant="compact" destinations={destinations} className="lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
