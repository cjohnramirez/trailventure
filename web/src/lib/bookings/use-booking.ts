"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/client";

import { fetchBooking } from "./api";
import type { Booking } from "./types";

/** Statuses the webhook can still move away from, so the page keeps polling. */
const SETTLING: Booking["status"][] = ["pending_payment"];

/**
 * Reads one booking, polling while Stripe's webhook may still be on its way. Payment confirmation
 * is asynchronous, so the success page cannot assume the redirect means "paid".
 */
export function useBooking(bookingId: string, { poll = false } = {}) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBooking(bookingId),
    refetchInterval: (query) => {
      if (!poll) return false;
      const status = query.state.data?.status;
      return status && SETTLING.includes(status) ? 2000 : false;
    },
    retry: (failureCount, error) => {
      // A 4xx means the booking is not this user's, or does not exist; retrying will not help.
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
      return failureCount < 2;
    },
  });
}
