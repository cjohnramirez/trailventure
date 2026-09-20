"use client";

import { BoxIcon, MapPinIcon, RouteIcon } from "lucide-react";
import * as React from "react";

import { BookingCard } from "@/components/booking/booking-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PackageDetail, Tier } from "@/lib/catalog/types";
import { formatTime } from "@/lib/format";

/**
 * The "Package Type" card and the itinerary column share the selected tier, as on the original
 * package page. `before` and `after` are server-rendered sections placed around the tier card.
 */
export function PackageTiers({
  pkg,
  before,
  after,
}: {
  pkg: PackageDetail;
  before: React.ReactNode;
  after: React.ReactNode;
}) {
  const [tierId, setTierId] = React.useState(pkg.tiers[0] ? String(pkg.tiers[0].id) : "");
  const tier = pkg.tiers.find((item) => String(item.id) === tierId) ?? pkg.tiers[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
      <div className="flex min-w-0 flex-col gap-6">
        {before}
        <Card id="package-type" className="scroll-mt-28 rounded-2xl">
          <CardHeader>
            <CardTitle>Package Type</CardTitle>
            <CardDescription>Choose the experience that suits you.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {pkg.tiers.length > 0 ? (
              <ToggleGroup
                type="single"
                variant="outline"
                value={tierId}
                onValueChange={(value) => value && setTierId(value)}
                aria-label="Package type"
                className="flex flex-wrap gap-2"
              >
                {pkg.tiers.map((item) => (
                  <ToggleGroupItem
                    key={item.id}
                    value={String(item.id)}
                    className="h-10 rounded-full px-4 data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-brand-foreground"
                  >
                    <BoxIcon />
                    {item.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <p className="type-ui text-muted-foreground">
                Package types for this trip are coming soon.
              </p>
            )}

            {tier?.description ? (
              <p className="type-body text-muted-foreground">{tier.description}</p>
            ) : null}

            <Separator />
            <AmenityList
              title="Package Amenities"
              description="Included with every package type."
              items={pkg.amenities}
            />
            <Separator />
            <AmenityList
              title="Package Type Amenities"
              description="Included with the selected package type."
              items={tier?.amenities ?? []}
            />
          </CardContent>
        </Card>
        {after}
      </div>
      <aside className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        {tier ? (
          <BookingCard
            packageSlug={pkg.slug}
            tier={tier}
            availableFrom={pkg.available_from}
            availableUntil={pkg.available_until}
          />
        ) : null}
        <section aria-labelledby="itinerary-title">
          <Itinerary tier={tier} />
        </section>
      </aside>
    </div>
  );
}

function AmenityList({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="type-body font-semibold">{title}</h3>
        <p className="type-ui text-muted-foreground">{description}</p>
      </div>
      {items.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-full border px-4 py-2.5 type-ui"
            >
              <BoxIcon aria-hidden="true" className="size-4.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-ui text-muted-foreground">None listed yet.</p>
      )}
    </section>
  );
}

function Itinerary({ tier }: { tier?: Tier }) {
  const stops = tier?.itinerary ?? [];
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle id="itinerary-title">Package Type Itinerary</CardTitle>
        {tier ? <CardDescription>{tier.name}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {stops.length === 0 ? (
          <Empty className="rounded-xl border py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RouteIcon />
              </EmptyMedia>
              <EmptyTitle>Itinerary coming soon</EmptyTitle>
              <EmptyDescription>
                The day-by-day plan for this package type hasn’t been published yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="flex flex-col gap-3">
            {stops.map((stop, index) => {
              const start = formatTime(stop.start_time);
              const end = formatTime(stop.end_time);
              return (
                <li
                  key={`${stop.day}-${stop.position}-${stop.title}`}
                  className="flex flex-col gap-3 rounded-xl border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline" className="h-7 rounded-full px-3 type-ui">
                      Route {index + 1} · Day {stop.day}
                    </Badge>
                    {start ? (
                      <span className="type-ui text-muted-foreground tabular-nums">
                        {start}
                        {end ? ` – ${end}` : ""}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="type-body font-semibold">{stop.title}</h4>
                    <p className="flex items-center gap-1.5 type-ui text-muted-foreground">
                      <MapPinIcon aria-hidden="true" className="size-4.5 shrink-0" />
                      {stop.location}
                    </p>
                  </div>
                  {stop.description ? (
                    <p className="type-ui text-pretty">{stop.description}</p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
