"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useSession } from "@/lib/auth/session";
import { fetchQuote } from "@/lib/bookings/api";
import type { Tier } from "@/lib/catalog/types";
import { toIsoDate } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export type BookingFlowInput = {
  packageSlug: string;
  tier: Tier;
  availableFrom: string;
  availableUntil: string;
};

export type BookingFlow = ReturnType<typeof useBookingFlow>;

/**
 * The state behind the booking card: a start date, a group size and the server's quote for them.
 * The sticky card and the mobile drawer each run their own copy; the quote query is shared by key.
 */
export function useBookingFlow({
  packageSlug,
  tier,
  availableFrom,
  availableUntil,
}: BookingFlowInput) {
  const router = useRouter();
  const { data: user } = useSession();
  const hydrated = useHydrated();
  // The session only exists in the browser, so waiting for hydration keeps the first client render
  // identical to the server HTML.
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

  // Fees are unknown until the server quotes, so the estimate is the tier price alone.
  const estimate = quote.data ?? {
    guests,
    base_amount: tier.price * guests,
    site_fee_amount: 0,
    tax_amount: 0,
    total_amount: tier.price * guests,
    tax_percent: "0",
    site_fee_percent: "0",
  };

  const selectDate = (value: Date | undefined) => {
    setDate(value);
    setDateError(null);
    setDatePickerOpen(false);
  };

  const book = () => {
    if (!date) {
      setDateError("Choose a start date to continue.");
      return;
    }
    const params = new URLSearchParams({
      tier: String(tier.id),
      guests: String(guests),
      start: toIsoDate(date),
    });
    const href = `/booking/${packageSlug}?${params.toString()}`;
    router.push(user ? href : `/login?next=${encodeURIComponent(href)}`);
  };

  return {
    hydrated,
    signedIn,
    tier,
    guests,
    setGuests,
    date,
    selectDate,
    dateError,
    datePickerOpen,
    setDatePickerOpen,
    earliest,
    windowEnd,
    quote,
    estimate,
    book,
  };
}
