"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ensureCsrfToken } from "@/lib/api/client";
import { PROVIDER_REDIRECT_URL, allauth } from "@/lib/auth/allauth";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-icon="inline-start">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

/**
 * "Continue with Google". allauth's provider redirect must be a real (non-XHR) form POST.
 * Hidden when the server has no Google credentials configured.
 */
export function GoogleButton({ next }: { next: string }) {
  const { data: providers } = useQuery({
    queryKey: ["auth-providers"],
    queryFn: allauth.providers,
    staleTime: Infinity,
  });
  const [pending, setPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const csrfRef = React.useRef<HTMLInputElement>(null);

  if (!providers?.some((provider) => provider.id === "google")) return null;

  const start = async () => {
    setPending(true);
    try {
      if (csrfRef.current) csrfRef.current.value = await ensureCsrfToken();
      formRef.current?.submit();
    } catch {
      setPending(false);
    }
  };

  return (
    <>
      <form ref={formRef} method="post" action={PROVIDER_REDIRECT_URL} className="contents">
        <input type="hidden" name="provider" value="google" />
        <input type="hidden" name="process" value="login" />
        <input
          type="hidden"
          name="callback_url"
          value={`/auth/callback?next=${encodeURIComponent(next)}`}
        />
        <input ref={csrfRef} type="hidden" name="csrfmiddlewaretoken" />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={start}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? <Spinner data-icon="inline-start" /> : <GoogleLogo />}
          Continue with Google
        </Button>
      </form>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Separator className="flex-1" />
        or
        <Separator className="flex-1" />
      </div>
    </>
  );
}
