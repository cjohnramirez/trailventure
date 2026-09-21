"use client";

import { StarIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MAX_RATING } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

const LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

/** Star rating as a single-choice toggle group, so it works with a keyboard like a radio group. */
export function RatingInput({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <ToggleGroup
        id={id}
        type="single"
        variant="outline"
        value={value ? String(value) : ""}
        onValueChange={(next) => next && onChange(Number(next))}
        aria-label="Rating"
        className="flex gap-1"
      >
        {Array.from({ length: MAX_RATING }, (_, index) => {
          const score = index + 1;
          return (
            <ToggleGroupItem
              key={score}
              value={String(score)}
              aria-label={`${score} ${score === 1 ? "star" : "stars"} — ${LABELS[index]}`}
              className="size-10 rounded-full border-transparent"
            >
              <StarIcon
                className={cn(score <= value ? "fill-rating text-rating" : "text-muted-foreground")}
              />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <span aria-hidden className="type-ui text-muted-foreground">
        {value ? LABELS[value - 1] : "Pick a score"}
      </span>
    </div>
  );
}
