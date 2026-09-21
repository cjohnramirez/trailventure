import type { Metadata } from "next";

import { SuccessResult } from "./success-result";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false },
};

export default async function BookingSuccessPage({ params }: PageProps<"/booking/success/[id]">) {
  const { id } = await params;
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-8">
      <SuccessResult bookingId={id} />
    </div>
  );
}
