"use client";

import { CircleCheckIcon, CircleXIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BookingResultCard, BookingResultSkeleton } from "@/components/booking/booking-result";
import { useConfetti } from "@/components/booking/confetti";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBooking } from "@/lib/bookings/use-booking";
import { formatApiDate, formatCentavos } from "@/lib/format";

/** How long to wait for Stripe's webhook before telling the visitor it is running late. */
const SLOW_CONFIRMATION_MS = 60_000;

export function SuccessResult({ bookingId }: { bookingId: string }) {
  const { data: booking, isPending, isError } = useBooking(bookingId, { poll: true });
  const [slow, setSlow] = React.useState(false);

  const confirmed = booking?.status === "confirmed";
  useConfetti(confirmed);

  React.useEffect(() => {
    if (confirmed) return;
    const timer = setTimeout(() => setSlow(true), SLOW_CONFIRMATION_MS);
    return () => clearTimeout(timer);
  }, [confirmed]);

  if (isPending) return <BookingResultSkeleton label="Loading your booking" />;

  if (isError || !booking) {
    return (
      <BookingResultCard
        icon={<CircleXIcon />}
        tone="destructive"
        title="We couldn’t find this booking"
        description="It may belong to a different account, or the link may be wrong. Your card is never charged twice, so it is safe to start again."
      >
        <Button asChild variant="brand" className="w-full sm:w-auto">
          <Link href="/">Go to Home</Link>
        </Button>
      </BookingResultCard>
    );
  }

  const details = [
    { label: "Booking ID", value: booking.id },
    { label: "Total paid (in PHP)", value: formatCentavos(booking.total_amount) },
    { label: "Package", value: `${booking.package.name} · ${booking.tier.name}` },
    {
      label: "Trip start",
      value: `${formatApiDate(booking.start_date)} · ${booking.guests} ${
        booking.guests === 1 ? "person" : "people"
      }`,
    },
  ];

  const actions = (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild variant="brand" className="w-full sm:w-auto">
        <Link href="/">Go to Home</Link>
      </Button>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href={`/package/${booking.package.slug}`}>View package</Link>
      </Button>
    </div>
  );

  if (booking.status === "expired" || booking.status === "cancelled") {
    return (
      <BookingResultCard
        icon={<CircleXIcon />}
        tone="destructive"
        title="This booking wasn’t paid"
        description="The hold on it ran out before the payment came through, so nothing was charged. You can book the same trip again."
        details={details}
      >
        {actions}
      </BookingResultCard>
    );
  }

  if (!confirmed) {
    return (
      <BookingResultCard
        icon={<Spinner className="size-12" />}
        tone="brand"
        title="Confirming your payment"
        description="Stripe is letting us know your payment went through. This page updates on its own."
        details={details}
      >
        {slow ? (
          <Alert>
            <InfoIcon />
            <AlertTitle>Confirmation is taking longer than usual</AlertTitle>
            <AlertDescription>
              Your payment is safe. Keep this page open, or check this booking again in a few
              minutes — the booking ID above is all you need.
            </AlertDescription>
          </Alert>
        ) : null}
        {actions}
      </BookingResultCard>
    );
  }

  return (
    <BookingResultCard
      icon={<CircleCheckIcon />}
      tone="brand"
      title="Booking Successful!"
      description="Here are the details of your transaction."
      details={details}
    >
      {actions}
    </BookingResultCard>
  );
}
