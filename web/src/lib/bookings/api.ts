"use client";

import { ApiError, apiRequest } from "@/lib/api/client";

import type { Booking, Quote } from "./types";

/** Turns an API error body into one sentence for the UI. */
async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as Record<string, unknown>;
    const detail = body.detail ?? Object.values(body)[0];
    const message = Array.isArray(detail) ? detail[0] : detail;
    if (typeof message === "string") return message;
  } catch {
    // Fall through to the generic message.
  }
  return "Something went wrong. Please try again.";
}

async function post<T>(path: string, json?: unknown): Promise<T> {
  const response = await apiRequest(path, { method: "POST", json });
  if (!response.ok) throw new ApiError(await readError(response), response.status);
  return (await response.json()) as T;
}

export function fetchQuote(input: { tier: number; guests: number; start_date?: string }) {
  return post<Quote>("/api/v1/bookings/quote/", input);
}

export function createBooking(input: { tier: number; guests: number; start_date: string }) {
  return post<Booking>("/api/v1/bookings/create/", input);
}

export function startCheckout(bookingId: string) {
  return post<{ checkout_url: string }>(`/api/v1/bookings/${bookingId}/checkout/`);
}

export async function fetchBooking(bookingId: string): Promise<Booking> {
  const response = await apiRequest(`/api/v1/bookings/${bookingId}/`);
  if (!response.ok) throw new ApiError(await readError(response), response.status);
  return (await response.json()) as Booking;
}
