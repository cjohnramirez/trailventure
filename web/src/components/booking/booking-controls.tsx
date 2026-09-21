"use client";

import { CalendarIcon, TriangleAlertIcon } from "lucide-react";

import { GuestStepper } from "@/components/booking/guest-stepper";
import { PriceBreakdown, PriceBreakdownSkeleton } from "@/components/booking/price-breakdown";
import type { BookingFlow } from "@/components/booking/use-booking-flow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Date, group size and the running total. Rendered twice — in the sticky card on large screens and
 * in the mobile drawer — so every id is prefixed to keep them unique.
 */
export function BookingControls({ flow, idPrefix }: { flow: BookingFlow; idPrefix: string }) {
  const dateId = `${idPrefix}-date`;
  const guestsId = `${idPrefix}-guests`;

  return (
    <>
      <FieldGroup>
        <Field data-invalid={Boolean(flow.dateError)}>
          <FieldLabel htmlFor={dateId}>Select tour date</FieldLabel>
          <Popover open={flow.datePickerOpen} onOpenChange={flow.setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                id={dateId}
                variant="outline"
                className="h-11 w-full justify-start"
                aria-invalid={Boolean(flow.dateError)}
              >
                <CalendarIcon data-icon="inline-start" />
                {flow.date ? flow.date.toLocaleDateString() : "Choose your date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <Calendar
                mode="single"
                selected={flow.date}
                onSelect={flow.selectDate}
                disabled={{ before: flow.earliest, after: flow.windowEnd }}
                defaultMonth={flow.date ?? flow.earliest}
                className="[--cell-size:--spacing(10)]"
              />
            </PopoverContent>
          </Popover>
          {flow.dateError ? <p className="type-ui text-destructive">{flow.dateError}</p> : null}
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor={guestsId}>Travelers</FieldLabel>
          <GuestStepper id={guestsId} value={flow.guests} onChange={flow.setGuests} />
        </Field>
      </FieldGroup>

      {flow.signedIn && flow.quote.isPending ? (
        <PriceBreakdownSkeleton />
      ) : (
        <PriceBreakdown amounts={flow.estimate} />
      )}

      {flow.hydrated && !flow.signedIn ? (
        <Alert>
          <TriangleAlertIcon />
          <AlertDescription>Fees and the total are calculated once you log in.</AlertDescription>
        </Alert>
      ) : null}

      <Button variant="brand" size="lg" onClick={flow.book} className="w-full">
        Book Now
      </Button>
    </>
  );
}
