import { CalendarIcon, SearchIcon, ShieldIcon, UserIcon, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/app/section-heading";
import { SlotPhoto } from "@/components/app/slot-photo";
import { photos } from "@/lib/photos";

type Feature = { icon: LucideIcon; title: string; body: string };

// Copy from the original site, kept to claims the rebuild actually supports.
const features: Feature[] = [
  {
    icon: CalendarIcon,
    title: "Hassle-Free Booking",
    body: "Pick a tier, a start date and your group size, then pay securely in a few steps.",
  },
  {
    icon: SearchIcon,
    title: "Advanced Search",
    body: "Filter tour packages by destination, dates, budget and review score.",
  },
  {
    icon: UserIcon,
    title: "Designed for You",
    body: "Compare package tiers side by side, with amenities and a day-by-day itinerary.",
  },
  {
    icon: ShieldIcon,
    title: "Secure and Trusted Bookings",
    body: "Verified accounts and Stripe checkout. In early access, payments run in test mode.",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <li className="flex flex-col gap-4 rounded-2xl border p-8">
      <Icon aria-hidden="true" className="size-12 stroke-[1.5]" />
      <div className="flex flex-col gap-2">
        <h3 className="type-card-title">{feature.title}</h3>
        <p className="type-body text-pretty text-muted-foreground">{feature.body}</p>
      </div>
    </li>
  );
}

/** The original "Choose us" grid: four feature cards around a tall hiking photo. */
export function ChooseUs() {
  return (
    <section aria-labelledby="choose-us-title" className="px-4 py-16 sm:px-8 md:py-24">
      <SectionHeading
        id="choose-us-title"
        title="Choose Us"
        subtitle="Your No. 1 tour package booking platform"
      />
      <ul className="mx-auto grid max-w-[75rem] gap-4 md:grid-cols-3">
        <FeatureCard feature={features[0]} />
        <li className="relative hidden min-h-[28rem] overflow-hidden rounded-2xl border md:row-span-2 md:block">
          <SlotPhoto photo={photos.hiker} sizes="(min-width: 768px) 24rem, 0px" />
        </li>
        <FeatureCard feature={features[1]} />
        <FeatureCard feature={features[2]} />
        <FeatureCard feature={features[3]} />
      </ul>
    </section>
  );
}
