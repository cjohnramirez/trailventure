"use client";

import { useQuery } from "@tanstack/react-query";
import { LuggageIcon, PenLineIcon } from "lucide-react";
import Link from "next/link";

import { BookingDetailsDialog } from "@/components/account/booking-details-dialog";
import { BookingStatusBadge } from "@/components/account/booking-status";
import { CatalogImage } from "@/components/app/catalog-image";
import { ErrorState } from "@/components/app/error-state";
import { ReviewDialog } from "@/components/reviews/review-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBookings } from "@/lib/bookings/api";
import type { Booking } from "@/lib/bookings/types";
import { formatApiDate, formatCentavos } from "@/lib/format";

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
        {booking.package.cover ? (
          <CatalogImage
            src={booking.package.cover.url}
            alt={booking.package.cover.alt}
            fill
            sizes="(min-width: 640px) 6rem, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="type-card-title">{booking.package.name}</h3>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="type-ui text-muted-foreground">
          {booking.tier.name} · {formatApiDate(booking.start_date)} · {booking.guests}{" "}
          {booking.guests === 1 ? "person" : "people"}
        </p>
        <p className="type-ui font-medium tabular-nums">{formatCentavos(booking.total_amount)}</p>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col">
        <BookingDetailsDialog booking={booking} />
        {booking.can_review ? (
          <ReviewDialog
            booking={booking}
            trigger={
              <Button variant="brand" size="sm">
                <PenLineIcon data-icon="inline-start" />
                Write a review
              </Button>
            }
          />
        ) : null}
        {booking.status === "pending_payment" && booking.is_hold_active ? (
          <Button asChild variant="brand" size="sm">
            <Link href={`/booking/cancelled/${booking.id}`}>Finish payment</Link>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

/** "Your Booking" from the original user page, backed by real bookings. */
export function BookingsSection() {
  const bookings = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings, staleTime: 30_000 });

  return (
    <section aria-labelledby="bookings-title" className="flex flex-col gap-6">
      <h2 id="bookings-title" className="type-card-title">
        Your Bookings
      </h2>

      {bookings.isPending ? (
        <div className="flex flex-col gap-4" role="status" aria-label="Loading your bookings">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl sm:h-[150px]" />
          ))}
        </div>
      ) : bookings.isError ? (
        <ErrorState
          title="We couldn’t load your bookings"
          description="Check your connection and try again."
          onRetry={() => void bookings.refetch()}
        />
      ) : bookings.data.length === 0 ? (
        <Empty className="rounded-2xl border py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LuggageIcon />
            </EmptyMedia>
            <EmptyTitle>No bookings yet</EmptyTitle>
            <EmptyDescription>
              Your trips show up here once you book one. Payments run in Stripe test mode.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="brand">
              <Link href="/search">Find a trip</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.data.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  );
}
