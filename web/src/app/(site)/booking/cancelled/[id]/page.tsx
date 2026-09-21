import type { Metadata } from "next";

import { CancelledResult } from "./cancelled-result";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default async function BookingCancelledPage({
  params,
}: PageProps<"/booking/cancelled/[id]">) {
  const { id } = await params;
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-8">
      <CancelledResult bookingId={id} />
    </div>
  );
}
