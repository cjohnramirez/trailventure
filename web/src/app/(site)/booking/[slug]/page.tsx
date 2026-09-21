import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPackage } from "@/lib/catalog/api";

import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Review your booking",
  robots: { index: false },
};

export default async function BookingPage({ params, searchParams }: PageProps<"/booking/[slug]">) {
  const { slug } = await params;
  const { tier, guests, start } = await searchParams;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-8 sm:px-8">
      <h1 className="type-page-title">Review your booking</h1>
      <BookingForm
        pkg={pkg}
        initialTierId={first(tier)}
        initialGuests={first(guests)}
        initialStart={first(start)}
      />
    </div>
  );
}
