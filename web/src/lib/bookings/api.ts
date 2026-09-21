"use client";

import { ApiError, apiRequest } from "@/lib/api/client";
import { readApiError } from "@/lib/api/errors";

import type { Booking, Quote } from "./types";

async function post<T>(path: string, json?: unknown): Promise<T> {
  const response = await apiRequest(path, { method: "POST", json });
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
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

export async function fetchBookings(): Promise<Booking[]> {
  const response = await apiRequest("/api/v1/bookings/");
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Booking[];
}

export async function fetchBooking(bookingId: string): Promise<Booking> {
  const response = await apiRequest(`/api/v1/bookings/${bookingId}/`);
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Booking;
}
