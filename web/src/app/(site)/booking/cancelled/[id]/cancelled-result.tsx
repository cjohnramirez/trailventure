"use client";

import { CircleCheckIcon, CircleXIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { BookingResultCard, BookingResultSkeleton } from "@/components/booking/booking-result";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api/client";
import { startCheckout } from "@/lib/bookings/api";
import { useBooking } from "@/lib/bookings/use-booking";
import { formatApiDate, formatCentavos } from "@/lib/format";

/** Minutes left on the hold, recomputed every 30s so the page never claims stale time. */
function useMinutesLeft(expiresAt: string | undefined) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  if (!expiresAt) return 0;
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - now) / 60_000));
}

export function CancelledResult({ bookingId }: { bookingId: string }) {
  const { data: booking, isPending, isError } = useBooking(bookingId);
  const [retrying, setRetrying] = React.useState(false);
  const minutesLeft = useMinutesLeft(booking?.hold_expires_at);

  const retry = async () => {
    setRetrying(true);
    try {
      const { checkout_url } = await startCheckout(bookingId);
      window.location.assign(checkout_url);
    } catch (cause) {
      toast.error(
        cause instanceof ApiError ? cause.message : "We couldn’t reopen checkout. Try again.",
      );
      setRetrying(false);
    }
  };

  if (isPending) return <BookingResultSkeleton label="Loading your booking" />;

  if (isError || !booking) {
    return (
      <BookingResultCard
        icon={<CircleXIcon />}
        tone="destructive"
        title="We couldn’t find this booking"
        description="It may belong to a different account, or the link may be wrong. Nothing was charged."
      >
        <Button asChild variant="brand" className="w-full sm:w-auto">
          <Link href="/">Go to Home</Link>
        </Button>
      </BookingResultCard>
    );
  }

  const details = [
    { label: "Booking ID", value: booking.id },
    { label: "Amount due (in PHP)", value: formatCentavos(booking.total_amount) },
    { label: "Package", value: `${booking.package.name} · ${booking.tier.name}` },
    {
      label: "Trip start",
      value: `${formatApiDate(booking.start_date)} · ${booking.guests} ${
        booking.guests === 1 ? "person" : "people"
      }`,
    },
  ];

  if (booking.status === "confirmed") {
    return (
      <BookingResultCard
        icon={<CircleCheckIcon />}
        tone="brand"
        title="This booking is already paid"
        description="Your payment came through before you cancelled, so the trip is confirmed."
        details={details}
      >
        <Button asChild variant="brand" className="w-full sm:w-auto">
          <Link href={`/booking/success/${booking.id}`}>See the confirmation</Link>
        </Button>
      </BookingResultCard>
    );
  }

  const canRetry = booking.status === "pending_payment" && booking.is_hold_active;

  return (
    <BookingResultCard
      icon={<CircleXIcon />}
      tone="destructive"
      title="Payment cancelled"
      description={
        canRetry
          ? `You left checkout, so nothing was charged. This price is held for ${minutesLeft} more ${
              minutesLeft === 1 ? "minute" : "minutes"
            } if you want to finish.`
          : "You left checkout, so nothing was charged, and the hold on this price has since run out. You can book the same trip again at today’s price."
      }
      details={details}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {canRetry ? (
          <Button
            variant="brand"
            onClick={retry}
            disabled={retrying}
            aria-busy={retrying}
            className="w-full sm:w-auto"
          >
            {retrying ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <CreditCardIcon data-icon="inline-start" />
            )}
            {retrying ? "Reopening checkout…" : "Try again"}
          </Button>
        ) : (
          <Button asChild variant="brand" className="w-full sm:w-auto">
            <Link href={`/package/${booking.package.slug}`}>Book this trip again</Link>
          </Button>
        )}
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </BookingResultCard>
  );
}
