import Link from "next/link";

import { cn } from "@/lib/utils";

/** The Summit mark: a teal tile with a two-peak ridge. Keep in sync with src/app/icon.svg. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-9 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect width="64" height="64" rx="16" className="fill-brand" />
      <path
        d="M7 43 L20.5 21 L32 37 L43.5 21 L57 43"
        fill="none"
        className="stroke-brand-foreground"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mark + TRAILVENTURE wordmark, linking home. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <LogoMark className={markClassName} />
      <span className="title text-4xl font-bold">TrailVenture</span>
    </Link>
  );
}
