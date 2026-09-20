"use client";

import * as React from "react";

import { BookingControls } from "@/components/booking/booking-controls";
import { useBookingFlow, type BookingFlowInput } from "@/components/booking/use-booking-flow";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { formatCentavos } from "@/lib/format";

/**
 * On phones and tablets the booking card would sit far down the page, so the price and a Book Now
 * button stay in a bar at the bottom and the controls open in a drawer.
 */
export function MobileBookingBar(props: BookingFlowInput) {
  const flow = useBookingFlow(props);
  const [open, setOpen] = React.useState(false);

  // Booking navigates away; closing first stops the drawer animating over the new page.
  const book = () => {
    setOpen(false);
    flow.book();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background p-4 lg:hidden">
      <div className="mx-auto flex max-w-screen-sm items-center justify-between gap-4">
        <p className="type-card-title">
          <span className="tabular-nums">{formatCentavos(props.tier.price)}</span>{" "}
          <span className="type-ui font-normal text-muted-foreground">/ person</span>
        </p>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="brand" size="lg">
              Book Now
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{props.tier.name}</DrawerTitle>
              <DrawerDescription>
                Choose your date and group size. Payments run in Stripe test mode.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-5 overflow-y-auto p-4 pt-0">
              <BookingControls flow={{ ...flow, book }} idPrefix="mobile-booking" />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
