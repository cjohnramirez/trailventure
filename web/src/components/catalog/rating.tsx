import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** "★ 4.6 (12 reviews)", or "New" before a package has reviews. */
export function Rating({
  average,
  count,
  className,
}: {
  average: number;
  count: number;
  className?: string;
}) {
  if (count === 0) {
    return (
      <span className={cn("type-ui text-muted-foreground", className)}>New · No reviews yet</span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 type-ui", className)}>
      <StarIcon aria-hidden="true" className="size-4.5 fill-rating text-rating" />
      <span className="font-semibold tabular-nums">{average.toFixed(1)}</span>
      <span className="text-muted-foreground">
        ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </span>
  );
}
