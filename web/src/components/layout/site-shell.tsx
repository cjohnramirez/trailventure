import { EarlyAccessBanner } from "@/components/layout/early-access-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDestinations } from "@/lib/catalog/api";

type SiteShellProps = {
  children: React.ReactNode;
  search?: "always" | "after-hero";
};

/** Banner, header, main content and footer: the same frame on every public page. */
export async function SiteShell({ children, search = "always" }: SiteShellProps) {
  // The header search pill still works (free-text search) if destinations can't load.
  const destinations = await getDestinations().catch(() => []);
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <EarlyAccessBanner />
      <SiteHeader
        destinations={destinations.map(({ slug, name, region }) => ({ slug, name, region }))}
        search={search}
      />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
