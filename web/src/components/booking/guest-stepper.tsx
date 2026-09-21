"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const MAX_GUESTS = 30;

/** Number of travelers, ordered − n + (the original had + n −). */
export function GuestStepper({
  value,
  onChange,
  id = "guests",
}: {
  value: number;
  onChange: (value: number) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Remove a traveler"
      >
        <MinusIcon />
      </Button>
      <output
        id={id}
        aria-live="polite"
        className="w-16 text-center type-ui font-semibold tabular-nums"
      >
        {value} {value === 1 ? "person" : "people"}
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(Math.min(MAX_GUESTS, value + 1))}
        disabled={value >= MAX_GUESTS}
        aria-label="Add a traveler"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
