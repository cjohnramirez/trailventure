"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { GuestStepper } from "@/components/booking/guest-stepper";
import { PriceBreakdown, PriceBreakdownSkeleton } from "@/components/booking/price-breakdown";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchQuote } from "@/lib/bookings/api";
import type { Tier } from "@/lib/catalog/types";
import { useSession } from "@/lib/auth/session";
import { formatCentavos, toIsoDate } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export type BookingCardProps = {
  packageSlug: string;
  tier: Tier;
  availableFrom: string;
  availableUntil: string;
};

/**
 * Pick a start date and group size, see the server-calculated total, then continue to the
 * booking page. The original had these controls inside the Package Type card; here they sit in
 * their own card, sticky beside the itinerary.
 */
export function BookingCard({
  packageSlug,
  tier,
  availableFrom,
  availableUntil,
}: BookingCardProps) {
  const router = useRouter();
  const { data: user } = useSession();
  const hydrated = useHydrated();
  const signedIn = hydrated && Boolean(user);
  const [guests, setGuests] = React.useState(2);
  const [date, setDate] = React.useState<Date | undefined>();
  const [dateError, setDateError] = React.useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const windowStart = parseDate(availableFrom);
  const windowEnd = parseDate(availableUntil);
  const today = new Date();
  const earliest = windowStart > today ? windowStart : today;

  const quote = useQuery({
    queryKey: ["quote", tier.id, guests],
    queryFn: () => fetchQuote({ tier: tier.id, guests }),
    // Signed-out visitors still see the tier price; quoting requires a session.
    enabled: signedIn,
    staleTime: 60_000,
  });

  const bookHref = () => {
    const params = new URLSearchParams({
      tier: String(tier.id),
      guests: String(guests),
      start: date ? toIsoDate(date) : "",
    });
    return `/booking/${packageSlug}?${params.toString()}`;
  };

  const onBook = () => {
    if (!date) {
      setDateError("Choose a start date to continue.");
      return;
    }
    const href = bookHref();
    router.push(user ? href : `/login?next=${encodeURIComponent(href)}`);
  };

  const estimate = quote.data ?? {
    guests,
    base_amount: tier.price * guests,
    site_fee_amount: 0,
    tax_amount: 0,
    total_amount: tier.price * guests,
    tax_percent: "0",
    site_fee_percent: "0",
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          <span className="tabular-nums">{formatCentavos(tier.price)}</span>{" "}
          <span className="type-ui font-normal text-muted-foreground">/ person</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field data-invalid={Boolean(dateError)}>
          <FieldLabel htmlFor="booking-date">Select tour date</FieldLabel>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                id="booking-date"
                variant="outline"
                className="h-11 w-full justify-start"
                aria-invalid={Boolean(dateError)}
              >
                <CalendarIcon data-icon="inline-start" />
                {date ? date.toLocaleDateString() : "Choose your date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(value) => {
                  setDate(value);
                  setDateError(null);
                  setDatePickerOpen(false);
                }}
                disabled={{ before: earliest, after: windowEnd }}
                defaultMonth={earliest}
                className="[--cell-size:--spacing(10)]"
              />
            </PopoverContent>
          </Popover>
          {dateError ? <p className="type-ui text-destructive">{dateError}</p> : null}
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="guests">Travelers</FieldLabel>
          <GuestStepper value={guests} onChange={setGuests} />
        </Field>

        {signedIn && quote.isPending ? (
          <PriceBreakdownSkeleton />
        ) : (
          <PriceBreakdown amounts={estimate} />
        )}

        {hydrated && !user ? (
          <Alert>
            <TriangleAlertIcon />
            <AlertDescription>Fees and the total are calculated once you log in.</AlertDescription>
          </Alert>
        ) : null}

        <Button variant="brand" size="lg" onClick={onBook} className="w-full">
          Book Now
        </Button>
        <p className="text-center type-caption text-muted-foreground">
          Early access: payments run in Stripe test mode, so you won’t be charged.
        </p>
      </CardContent>
    </Card>
  );
}
