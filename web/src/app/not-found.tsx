import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p className="title text-8xl font-bold text-muted-foreground">404</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">You seem lost</h1>
          <p className="text-muted-foreground">
            The page you’re looking for doesn’t exist or has moved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand" size="lg">
            <Link href="/">Return home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/search">Search trips</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
