"use client";

import { ApiError, apiRequest } from "@/lib/api/client";
import { readApiError } from "@/lib/api/errors";
import type { Booking } from "@/lib/bookings/types";

import type { Review } from "./types";

export async function createReview(input: {
  booking: Booking["id"];
  rating: number;
  comment: string;
}): Promise<Review> {
  const response = await apiRequest("/api/v1/reviews/", { method: "POST", json: input });
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Review;
}

export async function fetchMyReviews(): Promise<Review[]> {
  const response = await apiRequest("/api/v1/reviews/mine/");
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Review[];
}

export async function fetchPackageReviews(slug: string): Promise<Review[]> {
  const response = await apiRequest(`/api/v1/packages/${encodeURIComponent(slug)}/reviews/`);
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Review[];
}
