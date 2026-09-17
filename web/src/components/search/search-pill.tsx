"use client";

import { MapPinIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { formatDateRange, formatPeso } from "@/lib/format";
import { PRICE_MAX, PRICE_STEP, buildSearchHref } from "@/lib/search";
import { cn } from "@/lib/utils";

export type DestinationOption = { slug: string; name: string; region: string };

type SearchPillProps = {
  destinations: DestinationOption[];
  /** `inline`: the hero pill. `compact`: the header trigger that opens the pill in a popover. */
  variant?: "inline" | "compact";
  className?: string;
};

export function SearchPill({ destinations, variant = "inline", className }: SearchPillProps) {
  if (variant === "compact") {
    return <CompactSearch destinations={destinations} className={className} />;
  }
  return (
    <SearchSegments
      destinations={destinations}
      className={cn("rounded-full border bg-surface-muted p-2", className)}
    />
  );
}

function CompactSearch({
  destinations,
  className,
}: {
  destinations: DestinationOption[];
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-12 w-full justify-start gap-3 pr-6 pl-1.5", className)}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <SearchIcon />
          </span>
          <span className="flex-1 text-center">Search TrailVenture</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={10}
        className="w-[min(92vw,22rem)] rounded-3xl p-2 lg:w-auto lg:rounded-full"
      >
        <SearchSegments destinations={destinations} className="lg:flex-row" />
      </PopoverContent>
    </Popover>
  );
}

function SearchSegments({
  destinations,
  className,
}: {
  destinations: DestinationOption[];
  className?: string;
}) {
  const [destination, setDestination] = React.useState<DestinationOption | null>(null);
  const [dates, setDates] = React.useState<DateRange | undefined>();
  const [price, setPrice] = React.useState<[number, number]>([0, PRICE_MAX]);

  const href = buildSearchHref({
    destination: destination?.slug,
    from: dates?.from,
    to: dates?.to,
    minPrice: price[0],
    maxPrice: price[1],
  });

  const priceLabel =
    price[0] === 0 && price[1] === PRICE_MAX
      ? "Enter your budget"
      : `${formatPeso(price[0])} – ${price[1] === PRICE_MAX ? "any" : formatPeso(price[1])}`;

  return (
    <div className={cn("flex flex-col items-stretch gap-2 lg:flex-row lg:items-center", className)}>
      <DestinationSegment
        destinations={destinations}
        value={destination}
        onChange={setDestination}
      />
      <Popover>
        <PopoverTrigger asChild>
          <SegmentButton
            label="Date"
            value={formatDateRange(dates?.from, dates?.to) ?? "Choose your date"}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={dates}
            onSelect={setDates}
            disabled={{ before: new Date() }}
            className="[--cell-size:--spacing(10)]"
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <SegmentButton label="Price" value={priceLabel} />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-5" align="start">
          <PriceRange value={price} onChange={setPrice} />
        </PopoverContent>
      </Popover>
      <Button asChild variant="brand" size="lg" className="lg:h-14 lg:px-7">
        <Link href={href}>Find My Trailventure</Link>
      </Button>
    </div>
  );
}

function DestinationSegment({
  destinations,
  value,
  onChange,
}: {
  destinations: DestinationOption[];
  value: DestinationOption | null;
  onChange: (value: DestinationOption | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SegmentButton label="Destination" value={value?.name ?? "Set location"} />
      </PopoverTrigger>
      <PopoverContent className="w-[min(92vw,24rem)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Set your destination" />
          <CommandList>
            <CommandEmpty>No destinations found.</CommandEmpty>
            <CommandGroup>
              {value ? (
                <CommandItem
                  value="__any__"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  Anywhere
                </CommandItem>
              ) : null}
              {destinations.map((destination) => (
                <CommandItem
                  key={destination.slug}
                  value={`${destination.name} ${destination.region}`}
                  onSelect={() => {
                    onChange(destination);
                    setOpen(false);
                  }}
                  className="gap-3 py-2.5"
                >
                  <MapPinIcon />
                  <span className="flex flex-col">
                    <span className="font-medium">{destination.name}</span>
                    <span className="text-muted-foreground">{destination.region}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function PriceRange({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const setBound = (index: 0 | 1, raw: string) => {
    const parsed = Math.max(0, Math.min(PRICE_MAX, Number(raw) || 0));
    const next: [number, number] = [...value];
    next[index] = parsed;
    if (next[0] > next[1]) next[index === 0 ? 1 : 0] = parsed;
    onChange(next);
  };

  return (
    <FieldGroup className="gap-5">
      <Field>
        <FieldLabel>Budget per person</FieldLabel>
        <Slider
          min={0}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={value}
          onValueChange={(next) => onChange([next[0], next[1]] as [number, number])}
          aria-label="Budget per person"
          className="py-2"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="price-min">Minimum</FieldLabel>
          <Input
            id="price-min"
            type="number"
            inputMode="numeric"
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={value[0]}
            onChange={(event) => setBound(0, event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="price-max">Maximum</FieldLabel>
          <Input
            id="price-max"
            type="number"
            inputMode="numeric"
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={value[1]}
            onChange={(event) => setBound(1, event.target.value)}
          />
        </Field>
      </div>
    </FieldGroup>
  );
}

function SegmentButton({
  label,
  value,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { label: string; value: string }) {
  return (
    <Button
      variant="outline"
      className={cn("h-14 min-w-44 justify-start px-7 text-left", className)}
      {...props}
    >
      <span className="flex min-w-0 flex-col">
        <span className="text-sm leading-tight font-semibold">{label}</span>
        <span className="truncate text-sm leading-tight text-muted-foreground group-hover/button:text-brand-hover-foreground/70">
          {value}
        </span>
      </span>
    </Button>
  );
}
