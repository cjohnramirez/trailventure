import type { Metadata } from "next";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "TrailVenture is an early-access portfolio project: a tour-package booking site built with Next.js and Django.",
  alternates: { canonical: "/about" },
};

const stack = [
  { name: "Web", detail: "Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui" },
  { name: "API", detail: "Django, Django REST Framework, Celery, PostgreSQL, Redis" },
  { name: "Services", detail: "Stripe (test mode), Cloudinary, Mailjet, Google sign-in" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-4">
        <h1 className="title text-6xl font-bold sm:text-7xl">About TrailVenture</h1>
        <p className="text-lg text-pretty text-muted-foreground">
          TrailVenture is a tour-package booking site: search trips by destination, date and budget,
          compare package tiers and itineraries, and book.
        </p>
      </header>

      <Alert>
        <AlertTitle>Early access</AlertTitle>
        <AlertDescription>
          This is a portfolio project that is still being built. Trips, hosts and reviews are demo
          data, and checkout runs in Stripe test mode, so no real payment is taken. Use the test
          card 4242 4242 4242 4242 with any future expiry date and any CVC.
        </AlertDescription>
      </Alert>

      <section aria-labelledby="stack-title" className="flex flex-col gap-4">
        <h2 id="stack-title" className="text-2xl font-semibold">
          How it’s built
        </h2>
        <dl className="flex flex-col divide-y rounded-2xl border">
          {stack.map((item) => (
            <div key={item.name} className="flex flex-col gap-1 p-5 sm:flex-row sm:gap-6">
              <dt className="w-24 shrink-0 font-semibold">{item.name}</dt>
              <dd className="text-muted-foreground">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="brand" size="lg">
          <Link href="/search">Find My Trailventure</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
