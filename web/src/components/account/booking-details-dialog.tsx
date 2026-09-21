"use client";

import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { BookingStatusBadge } from "@/components/account/booking-status";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Booking } from "@/lib/bookings/types";
import { formatApiDate } from "@/lib/format";

/** The original's "See Booking Details" dialog, now showing the real price snapshot. */
export function BookingDetailsDialog({ booking }: { booking: Booking }) {
  const rows = [
    { label: "Booking ID", value: booking.id },
    { label: "Package type", value: booking.tier.name },
    { label: "Trip start", value: formatApiDate(booking.start_date) },
    { label: "Booked on", value: formatApiDate(booking.created_at.slice(0, 10)) },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See Booking Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{booking.package.name}</DialogTitle>
          <DialogDescription>{booking.package.address}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <BookingStatusBadge status={booking.status} />
          <dl className="flex flex-col gap-3">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap justify-between gap-2">
                <dt className="type-ui text-muted-foreground">{row.label}</dt>
                <dd className="type-ui font-medium break-all">{row.value}</dd>
              </div>
            ))}
          </dl>
          <Separator />
          <PriceBreakdown amounts={booking} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
