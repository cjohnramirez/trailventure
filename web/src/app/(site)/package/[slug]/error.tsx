"use client";

import Link from "next/link";

import { ErrorState } from "@/components/app/error-state";
import { Button } from "@/components/ui/button";

export default function PackageError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 sm:px-8">
      <ErrorState
        title="We couldn’t load this package"
        description="The package details are unavailable right now. Try again in a moment."
        onRetry={reset}
      />
      <Button asChild variant="outline" className="self-start">
        <Link href="/search">Browse other packages</Link>
      </Button>
    </div>
  );
}
