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
      <div className="mx-auto flex max-w-screen-2xl items-center gap-2 py-1.5 pr-2 pl-4 lg:gap-3 lg:px-8">
        <p className="flex-1 type-ui text-pretty lg:text-center">
          <span className="font-semibold">
            <span className="lg:hidden">Early access:</span>
            <span className="hidden lg:inline">TrailVenture is in early access.</span>
          </span>{" "}
          <span className="lg:hidden">demo site.</span>
          <span className="hidden lg:inline">
            It’s a portfolio project: trips are demo data and payments run in Stripe test mode.
          </span>{" "}
          <Link
            href="/about"
            className="font-medium whitespace-nowrap underline underline-offset-4"
          >
            Learn more
            {/* Keeps the visible banner short while the link still reads descriptively. */}
            <span className="sr-only"> about TrailVenture’s early access</span>
          </Link>
        </p>
        <Button variant="ghost" size="icon" onClick={dismiss} aria-label="Dismiss notice">
          <XIcon />
        </Button>
      </div>
    </div>
  );
}
