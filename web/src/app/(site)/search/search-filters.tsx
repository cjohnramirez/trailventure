"use client";

import { CheckIcon, ChevronDownIcon, FilterIcon, MapPinIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toSearchQuery, type SearchFilters } from "@/lib/catalog/search-params";
import type { DestinationSummary } from "@/lib/catalog/types";
import { formatPeso, toIsoDate } from "@/lib/format";
import { PRICE_MAX, PRICE_STEP } from "@/lib/search";

const RATINGS = [
  { value: "5", label: "Excellent", hint: "5" },
  { value: "4", label: "Great", hint: "4+" },
  { value: "3", label: "Good", hint: "3+" },
  { value: "2", label: "Fair", hint: "2+" },
];

function parseDate(value?: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

type FiltersProps = { filters: SearchFilters; destinations: DestinationSummary[] };

/** The original "Filters" panel: date range, price range, destination and review score. */
export function SearchFilters({ filters, destinations }: FiltersProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <aside
        aria-labelledby="filters-title"
        className="hidden self-start rounded-2xl border p-6 lg:sticky lg:top-24 lg:block"
      >
        <FiltersForm filters={filters} destinations={destinations} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <FilterIcon data-icon="inline-start" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down tour packages.</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <FiltersForm
              filters={filters}
              destinations={destinations}
              hideTitle
              onApplied={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FiltersForm({
  filters,
  destinations,
  hideTitle,
  onApplied,
}: FiltersProps & { hideTitle?: boolean; onApplied?: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [dates, setDates] = React.useState<DateRange | undefined>({
    from: parseDate(filters.start),
    to: parseDate(filters.end),
  });
  const [price, setPrice] = React.useState<[number, number]>([
    filters.min_price ?? 0,
    filters.max_price ?? PRICE_MAX,
  ]);
  const [destination, setDestination] = React.useState(filters.destination);
  const [rating, setRating] = React.useState(filters.rating ? String(filters.rating) : "");

  const navigate = (next: SearchFilters) => {
    const query = toSearchQuery(next);
    startTransition(() => {
      router.push(query ? `/search?${query}` : "/search", { scroll: false });
    });
    onApplied?.();
  };

  const apply = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({
      destination,
      start: dates?.from ? toIsoDate(dates.from) : undefined,
      end: dates?.to ? toIsoDate(dates.to) : dates?.from ? toIsoDate(dates.from) : undefined,
      min_price: price[0] > 0 ? price[0] : undefined,
      max_price: price[1] < PRICE_MAX ? price[1] : undefined,
      rating: rating ? Number(rating) : undefined,
    });
  };

  const clear = () => {
    setDates(undefined);
    setPrice([0, PRICE_MAX]);
    setDestination(undefined);
    setRating("");
    navigate({});
  };

  const destinationName = destinations.find((item) => item.slug === destination)?.name;

  return (
    <form onSubmit={apply} className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        {hideTitle ? (
          <span />
        ) : (
          <h2 id="filters-title" className="type-card-title">
            Filters
          </h2>
        )}
        <Button type="button" variant="outline" size="sm" onClick={clear} disabled={pending}>
          <XIcon data-icon="inline-start" />
          Clear Filter
        </Button>
      </div>

      <FieldGroup className="gap-6">
        <div className="rounded-2xl border p-4">
          <FieldSet className="gap-3">
            <FieldLegend variant="label">Set date range</FieldLegend>
            <Calendar
              mode="range"
              selected={dates}
              onSelect={setDates}
              disabled={{ before: new Date() }}
              className="mx-auto [--cell-size:--spacing(9)]"
            />
          </FieldSet>
        </div>

        <div className="rounded-2xl border p-4">
          <FieldSet className="gap-4">
            <FieldLegend variant="label">Price range per person</FieldLegend>
            <Slider
              min={0}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={price}
              onValueChange={(next) => setPrice([next[0], next[1]] as [number, number])}
              thumbLabels={["Minimum price per person", "Maximum price per person"]}
            />
            <p className="type-ui text-muted-foreground tabular-nums">
              {formatPeso(price[0])} – {price[1] === PRICE_MAX ? "any" : formatPeso(price[1])}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="filter-min-price">Minimum</FieldLabel>
                <Input
                  id="filter-min-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={PRICE_STEP}
                  value={price[0]}
                  onChange={(event) =>
                    setPrice([Math.min(Number(event.target.value) || 0, price[1]), price[1]])
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="filter-max-price">Maximum</FieldLabel>
                <Input
                  id="filter-max-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={PRICE_STEP}
                  value={price[1]}
                  onChange={(event) =>
                    setPrice([
                      price[0],
                      Math.max(Math.min(Number(event.target.value) || 0, PRICE_MAX), price[0]),
                    ])
                  }
                />
              </Field>
            </div>
          </FieldSet>
        </div>

        <div className="rounded-2xl border p-4">
          <FieldSet className="gap-3">
            <FieldLegend variant="label">Destination</FieldLegend>
            <DestinationPicker
              destinations={destinations}
              value={destination}
              label={destinationName}
              onChange={setDestination}
            />
          </FieldSet>
        </div>

        <div className="rounded-2xl border p-4">
          <FieldSet className="gap-3">
            <FieldLegend variant="label">Review score</FieldLegend>
            <ToggleGroup
              type="single"
              variant="outline"
              value={rating}
              onValueChange={setRating}
              className="grid w-full grid-cols-2 gap-2"
            >
              {RATINGS.map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  className="h-10 rounded-full data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
                >
                  {item.label} {item.hint}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FieldSet>
        </div>
      </FieldGroup>

      <Button type="submit" variant="brand" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? <Spinner data-icon="inline-start" /> : null}
        Apply Filter
      </Button>
    </form>
  );
}

function DestinationPicker({
  destinations,
  value,
  label,
  onChange,
}: {
  destinations: DestinationSummary[];
  value?: string;
  label?: string;
  onChange: (value: string | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-between">
          <span className="inline-flex items-center gap-2">
            <MapPinIcon data-icon="inline-start" />
            {label ?? "Anywhere"}
          </span>
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(92vw,22rem)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search destinations" />
          <CommandList>
            <CommandEmpty>No destinations found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="anywhere"
                onSelect={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                Anywhere
              </CommandItem>
              {destinations.map((destination) => (
                <CommandItem
                  key={destination.slug}
                  value={`${destination.name} ${destination.region}`}
                  onSelect={() => {
                    onChange(destination.slug);
                    setOpen(false);
                  }}
                >
                  <MapPinIcon />
                  <span className="flex flex-1 flex-col">
                    <span>{destination.name}</span>
                    <span className="text-muted-foreground">{destination.region}</span>
                  </span>
                  {destination.slug === value ? <CheckIcon aria-label="Selected" /> : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
