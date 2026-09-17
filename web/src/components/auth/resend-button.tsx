"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { AuthResult } from "@/lib/auth/allauth";

const COOLDOWN_SECONDS = 60;

/** "Send a new code" with a cooldown, so people can't hammer the rate limit by accident. */
export function ResendButton({ resend }: { resend: () => Promise<AuthResult> }) {
  const [pending, setPending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(COOLDOWN_SECONDS);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const onClick = async () => {
    setPending(true);
    try {
      const result = await resend();
      if (result.kind === "error") {
        toast.error(result.formError ?? "We couldn’t send a new code. Try again shortly.");
      } else {
        toast.success("We sent you a new code.");
        setCooldown(COOLDOWN_SECONDS);
      }
    } catch {
      toast.error("We couldn’t send a new code. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  const waiting = cooldown > 0;
  return (
    <Button
      type="button"
      variant="link"
      onClick={onClick}
      disabled={pending || waiting}
      aria-busy={pending}
      className="h-auto px-0"
    >
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {waiting ? `Send a new code in ${cooldown}s` : "Send a new code"}
    </Button>
  );
}
