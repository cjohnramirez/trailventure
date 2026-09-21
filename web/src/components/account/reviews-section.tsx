"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquareIcon } from "lucide-react";

import { ErrorState } from "@/components/app/error-state";
import { ReviewCard } from "@/components/reviews/review-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMyReviews } from "@/lib/reviews/api";

/** "Your Reviews" from the original user page. */
export function ReviewsSection() {
  const reviews = useQuery({ queryKey: ["reviews"], queryFn: fetchMyReviews, staleTime: 30_000 });

  return (
    <section aria-labelledby="reviews-title" className="flex flex-col gap-6">
      <h2 id="reviews-title" className="type-card-title">
        Your Reviews
      </h2>

      {reviews.isPending ? (
        <div className="grid gap-4 md:grid-cols-2" role="status" aria-label="Loading your reviews">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : reviews.isError ? (
        <ErrorState
          title="We couldn’t load your reviews"
          description="Check your connection and try again."
          onRetry={() => void reviews.refetch()}
        />
      ) : reviews.data.length === 0 ? (
        <Empty className="rounded-2xl border py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareIcon />
            </EmptyMedia>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
              Once a trip you paid for has started, you can review it from your bookings.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.data.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
