import { EarlyAccessBanner } from "@/components/layout/early-access-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { DestinationOption } from "@/components/search/search-pill";

type SiteShellProps = {
  children: React.ReactNode;
  search?: "always" | "after-hero";
};

// Destinations for the search pill come from the catalog API once it exists (M4).
const destinations: DestinationOption[] = [];

/** Banner, header, main content and footer: the same frame on every public page. */
export function SiteShell({ children, search = "always" }: SiteShellProps) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <EarlyAccessBanner />
      <SiteHeader destinations={destinations} search={search} />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
