"use client";

import { BookingControls } from "@/components/booking/booking-controls";
import { useBookingFlow, type BookingFlowInput } from "@/components/booking/use-booking-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentavos } from "@/lib/format";

/**
 * Pick a start date and group size, see the server-calculated total, then continue to the booking
 * page. The original had these controls inside the Package Type card; here they sit in their own
 * card, sticky beside the itinerary. Below `lg` the mobile bar replaces it.
 */
export function BookingCard(props: BookingFlowInput) {
  const flow = useBookingFlow(props);

  return (
    <Card className="hidden rounded-2xl lg:flex">
      <CardHeader>
        <CardTitle>
          <span className="tabular-nums">{formatCentavos(props.tier.price)}</span>{" "}
          <span className="type-ui font-normal text-muted-foreground">/ person</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <BookingControls flow={flow} idPrefix="booking" />
        <p className="text-center type-caption text-muted-foreground">
          Early access: payments run in Stripe test mode, so you won’t be charged.
        </p>
      </CardContent>
    </Card>
  );
}
