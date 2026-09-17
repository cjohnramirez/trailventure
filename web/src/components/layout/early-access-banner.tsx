"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const EARLY_ACCESS_STORAGE_KEY = "tv-early-access-dismissed";

/**
 * Inline script for <head>: hides the banner before first paint for visitors who dismissed it,
 * so it never flashes. Storage can be unavailable (private mode, blocked site data): fail open.
 */
export const earlyAccessBannerScript = `try{if(localStorage.getItem("${EARLY_ACCESS_STORAGE_KEY}")){document.documentElement.dataset.earlyAccessDismissed="true"}}catch(e){}`;

export function EarlyAccessBanner() {
  const dismiss = () => {
    document.documentElement.dataset.earlyAccessDismissed = "true";
    try {
      localStorage.setItem(EARLY_ACCESS_STORAGE_KEY, "1");
    } catch {
      // Dismissal just won't persist across visits.
    }
  };

  return (
    <div
      role="region"
      aria-label="Early access notice"
      className="border-b bg-surface-muted in-data-[early-access-dismissed=true]:hidden"
    >
      <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2 sm:px-8">
        <p className="flex-1 text-center text-sm text-pretty">
          <span className="font-semibold">TrailVenture is in early access.</span> It’s a portfolio
          project: trips are demo data and payments run in Stripe test mode.{" "}
          <Link href="/about" className="font-medium underline underline-offset-4">
            Learn more
          </Link>
        </p>
        <Button variant="ghost" size="icon-sm" onClick={dismiss} aria-label="Dismiss notice">
          <XIcon />
        </Button>
      </div>
    </div>
  );
}
