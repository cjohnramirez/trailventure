"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { safeNextPath } from "@/lib/auth/redirects";
import { sessionQueryKey, type SessionUser } from "@/lib/auth/session";
import { apiRequest } from "@/lib/api/client";

/** Where allauth sends the browser back after Google sign-in. */
export function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const next = safeNextPath(searchParams.get("next"));
  const error = searchParams.get("error");

  React.useEffect(() => {
    let cancelled = false;
    const finish = async () => {
      if (error) {
        router.replace(`/login?error=social&next=${encodeURIComponent(next)}`);
        return;
      }
      try {
        const response = await apiRequest("/api/v1/auth/me/");
        const { user } = (await response.json()) as { user: SessionUser | null };
        if (cancelled) return;
        queryClient.setQueryData(sessionQueryKey, user);
        if (user) {
          toast.success(`Welcome, ${user.display_name}!`);
          router.replace(next);
          router.refresh();
        } else {
          router.replace(`/login?error=social&next=${encodeURIComponent(next)}`);
        }
      } catch {
        if (!cancelled) router.replace(`/login?error=social&next=${encodeURIComponent(next)}`);
      }
    };
    void finish();
    return () => {
      cancelled = true;
    };
  }, [error, next, queryClient, router]);

  return (
    <div className="flex flex-col items-center gap-3 text-muted-foreground" role="status">
      <Spinner className="size-6" />
      <p>Finishing sign-in…</p>
    </div>
  );
}
