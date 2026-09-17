import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

const links = [
  { href: "/search", label: "Search trips" },
  { href: "/about", label: "About" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-surface-muted">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 py-12 sm:px-20">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <span className="title text-3xl font-bold">TrailVenture</span>
          </Link>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {year} Trailventure. All rights reserved.</p>
          <p>Portfolio project in early access. Payments run in Stripe test mode.</p>
        </div>
      </div>
    </footer>
  );
}
