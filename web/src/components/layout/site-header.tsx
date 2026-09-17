"use client";

import * as React from "react";

import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { SearchPill, type DestinationOption } from "@/components/search/search-pill";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const HERO_SEARCH_ID = "hero-search";

type SiteHeaderProps = {
  destinations: DestinationOption[];
  /**
   * `always`: compact search pill in the header (most pages).
   * `after-hero`: only once the hero's search pill has scrolled out of view (home page).
   */
  search?: "always" | "after-hero";
};

export function SiteHeader({ destinations, search = "always" }: SiteHeaderProps) {
  const heroHidden = useHeroSearchHidden(search === "after-hero");
  const scrolled = useScrolled();
  const showSearch = search === "always" || heroHidden;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-transparent bg-background transition-colors",
        scrolled && "border-border",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-screen-2xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-8",
          showSearch && "xl:grid-cols-[1fr_minmax(0,28rem)_1fr]",
        )}
      >
        <div className="flex items-center gap-3">
          <Logo />
          <Badge variant="outline" className="hidden rounded-full sm:inline-flex">
            Early access
          </Badge>
        </div>
        {showSearch ? (
          <SearchPill
            variant="compact"
            destinations={destinations}
            className="col-span-2 row-start-2 xl:col-span-1 xl:row-start-1"
          />
        ) : null}
        <div className="flex justify-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** True once the element with id HERO_SEARCH_ID has scrolled out of view. */
function useHeroSearchHidden(enabled: boolean) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    if (!enabled) return;
    const target = document.getElementById(HERO_SEARCH_ID);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(!entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled]);
  return hidden;
}
