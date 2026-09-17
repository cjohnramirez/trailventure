"use client";

import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/** Inline error with a retry that re-renders the current route's server data. */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load this right now. Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const retry = () => (onRetry ? onRetry() : startTransition(() => router.refresh()));

  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={retry} disabled={pending} aria-busy={pending}>
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RotateCcwIcon data-icon="inline-start" />
          )}
          Try again
        </Button>
      </AlertAction>
    </Alert>
  );
}
