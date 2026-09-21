import Link from "next/link";

import { Button } from "@/components/ui/button";

export function NotFoundContent({
  title = "You seem lost",
  description = "The page you’re looking for doesn’t exist or has moved.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="type-page-title text-muted-foreground">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="type-heading">{title}</h1>
        <p className="type-body text-muted-foreground">{description}</p>
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
  );
}
