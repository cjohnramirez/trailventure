"use client";

import { useQuery } from "@tanstack/react-query";
import { PenLineIcon } from "lucide-react";

import { ReviewDialog } from "@/components/reviews/review-dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { fetchBookings } from "@/lib/bookings/api";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * The original's "Add Comment" button, but only for travelers who actually took this trip: the
 * API only accepts a review for a paid booking whose start date has passed.
 */
export function WriteReview({ packageSlug }: { packageSlug: string }) {
  const { data: user } = useSession();
  const hydrated = useHydrated();
  const signedIn = hydrated && Boolean(user);

  const bookings = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: signedIn,
    staleTime: 60_000,
  });

  const reviewable = bookings.data?.find(
    (booking) => booking.package.slug === packageSlug && booking.can_review,
  );
  if (!reviewable) return null;

  return (
    <ReviewDialog
      booking={reviewable}
      trigger={
        <Button variant="outline">
          <PenLineIcon data-icon="inline-start" />
          Add Comment
        </Button>
      }
    />
  );
}
