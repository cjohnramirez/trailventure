"use client";

import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/session";

/**
 * The original user page's "User Details" section. Avatar, banner, bookings and reviews join this
 * page in M6.
 */
export function AccountDetails() {
  const { data: user, isPending, isError, refetch, isRefetching } = useSession();

  if (isError) {
    return (
      <Alert variant="destructive">
        <TriangleAlertIcon />
        <AlertTitle>We couldn’t load your account</AlertTitle>
        <AlertDescription>Check your connection and try again.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RotateCcwIcon data-icon="inline-start" />
            Try again
          </Button>
        </AlertAction>
      </Alert>
    );
  }

  if (!isPending && !user) {
    return (
      <Alert>
        <AlertTitle>You’re logged out</AlertTitle>
        <AlertDescription>Log in again to see your account.</AlertDescription>
        <AlertAction>
          <Button asChild size="sm" variant="brand">
            <Link href="/login?next=/account">Login</Link>
          </Button>
        </AlertAction>
      </Alert>
    );
  }

  const rows = [
    { label: "First Name", value: user?.first_name },
    { label: "Last Name", value: user?.last_name },
    { label: "Email", value: user?.email },
  ];

  return (
    <section
      aria-labelledby="details-title"
      className="flex flex-col gap-6 rounded-2xl border p-6 sm:p-8"
    >
      <h2 id="details-title" className="text-xl font-semibold">
        User Details
      </h2>
      <dl className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4 rounded-2xl border p-4 sm:p-5">
            <dt className="w-28 shrink-0 border-r pr-4 text-muted-foreground">{row.label}</dt>
            <dd className="min-w-0 truncate font-medium">
              {isPending ? <Skeleton className="h-5 w-40" /> : row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
