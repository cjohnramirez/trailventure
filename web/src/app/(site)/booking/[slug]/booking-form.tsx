"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  CreditCardIcon,
  InfoIcon,
  MapPinIcon,
  PackageIcon,
  PhilippinePesoIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { CatalogImage } from "@/components/app/catalog-image";
import { GuestStepper } from "@/components/booking/guest-stepper";
import { PriceBreakdown, PriceBreakdownSkeleton } from "@/components/booking/price-breakdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ApiError } from "@/lib/api/client";
import { createBooking, fetchQuote, startCheckout } from "@/lib/bookings/api";
import type { PackageDetail } from "@/lib/catalog/types";
import { toIsoDate } from "@/lib/format";

function parseDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function BookingForm({
  pkg,
  initialTierId,
  initialGuests,
  initialStart,
}: {
  pkg: PackageDetail;
  initialTierId?: string;
  initialGuests?: string;
  initialStart?: string;
}) {
  const router = useRouter();
  const fallbackTier = pkg.tiers[0];
  const [tierId, setTierId] = React.useState(
    pkg.tiers.find((tier) => String(tier.id) === initialTierId)?.id ?? fallbackTier?.id,
  );
  const [guests, setGuests] = React.useState(() => {
    const parsed = Number(initialGuests);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 30 ? parsed : 2;
  });
  const [date, setDate] = React.useState<Date | undefined>(parseDate(initialStart));
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const tier = pkg.tiers.find((item) => item.id === tierId) ?? fallbackTier;
  const windowStart = parseDate(pkg.available_from)!;
  const windowEnd = parseDate(pkg.available_until)!;
  const today = new Date();
  const earliest = windowStart > today ? windowStart : today;

  const quote = useQuery({
    queryKey: ["quote", tier?.id, guests],
    queryFn: () => fetchQuote({ tier: tier!.id, guests }),
    enabled: Boolean(tier),
    staleTime: 60_000,
  });

  const checkout = async () => {
    if (!tier || !date) {
      setError("Choose a package type and a start date first.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const booking = await createBooking({
        tier: tier.id,
        guests,
        start_date: toIsoDate(date),
      });
      const { checkout_url } = await startCheckout(booking.id);
      // Stripe Checkout is hosted, so this is a full navigation, not a router push.
      window.location.assign(checkout_url);
    } catch (cause) {
      const message =
        cause instanceof ApiError ? cause.message : "We couldn’t start checkout. Try again.";
      setError(message);
      toast.error(message);
      setPending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
      <div className="flex min-w-0 flex-col gap-6">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-64">
              {pkg.images[0] ? (
                <CatalogImage
                  src={pkg.images[0].url}
                  alt={pkg.images[0].alt}
                  fill
                  sizes="(min-width: 640px) 16rem, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              <h2 className="type-card-title">{pkg.name}</h2>
              <p className="flex items-center gap-2 type-ui text-muted-foreground">
                <MapPinIcon className="size-4.5 shrink-0" aria-hidden />
                {pkg.address}
              </p>
              <p className="flex items-center gap-3 rounded-xl border px-4 py-3 type-ui">
                <PackageIcon className="size-4.5 shrink-0 text-muted-foreground" aria-hidden />
                Package type: <span className="font-medium">{tier?.name ?? "—"}</span>
              </p>
              <Button asChild variant="link" className="h-auto w-fit px-0">
                <Link href={`/package/${pkg.slug}`}>View package details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Package configuration</CardTitle>
            <CardDescription>These are your package details. Change if you wish.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Separator />
            <Field>
              <FieldLabel>Package type</FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={String(tierId)}
                onValueChange={(value) => value && setTierId(Number(value))}
                aria-label="Package type"
                className="flex flex-wrap gap-2"
              >
                {pkg.tiers.map((item) => (
                  <ToggleGroupItem
                    key={item.id}
                    value={String(item.id)}
                    className="h-10 rounded-full px-4 data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
                  >
                    <PackageIcon />
                    {item.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="start-date">Start date</FieldLabel>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button id="start-date" variant="outline" className="h-11 justify-start">
                      <CalendarIcon data-icon="inline-start" />
                      {date ? date.toLocaleDateString() : "Choose your date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        setDate(value);
                        setDatePickerOpen(false);
                      }}
                      disabled={{ before: earliest, after: windowEnd }}
                      defaultMonth={date ?? earliest}
                      className="[--cell-size:--spacing(10)]"
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field>
                <FieldLabel htmlFor="guests">Number of people</FieldLabel>
                <GuestStepper id="guests" value={guests} onChange={setGuests} />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Package rules</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <p className="type-ui text-muted-foreground">
              Before proceeding, read the rules for this tour package.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Read here</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Package rules</DialogTitle>
                  <DialogDescription>
                    TrailVenture is an early-access portfolio project, so these trips are demo data
                    and no real booking is made.
                  </DialogDescription>
                </DialogHeader>
                <ul className="flex list-disc flex-col gap-2 pl-5 type-ui">
                  <li>Your price is held for 30 minutes while you pay.</li>
                  <li>Payments run in Stripe test mode; use card 4242 4242 4242 4242.</li>
                  <li>Unpaid bookings expire on their own. Nothing is charged.</li>
                </ul>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <aside aria-labelledby="invoice-title" className="lg:sticky lg:top-28 lg:self-start">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle id="invoice-title">Invoice</CardTitle>
            <CardAction>
              <Badge variant="outline" className="rounded-full">
                <PhilippinePesoIcon aria-hidden />
                In PHP
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {quote.isPending || !quote.data ? (
              <PriceBreakdownSkeleton />
            ) : (
              <PriceBreakdown amounts={quote.data} />
            )}

            <Alert>
              <InfoIcon />
              <AlertTitle>Test mode</AlertTitle>
              <AlertDescription>
                Pay with card 4242 4242 4242 4242, any future expiry and any CVC. No money moves.
              </AlertDescription>
            </Alert>

            {error ? <p className="type-ui text-destructive">{error}</p> : null}

            <Button
              variant="brand"
              size="lg"
              onClick={checkout}
              disabled={pending || !date || !tier}
              aria-busy={pending}
              className="w-full"
            >
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <CreditCardIcon data-icon="inline-start" />
              )}
              {pending ? "Starting checkout…" : "Proceed to checkout"}
            </Button>
            {!date ? (
              <p className="text-center type-ui text-muted-foreground">
                Choose a start date to continue.
              </p>
            ) : null}
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              Go back
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
