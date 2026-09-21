import { StarIcon } from "lucide-react";

import { MAX_RATING } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

/** A read-only 1–5 star score, announced as text for screen readers. */
export function ReviewStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of ${MAX_RATING} stars`}
    >
      {Array.from({ length: MAX_RATING }, (_, index) => (
        <StarIcon
          key={index}
          aria-hidden
          className={cn(
            "size-4.5",
            index < rating ? "fill-rating text-rating" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}
