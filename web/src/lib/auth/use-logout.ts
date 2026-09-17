"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { allauth } from "@/lib/auth/allauth";
import { sessionQueryKey } from "@/lib/auth/session";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = React.useState(false);

  const logout = async () => {
    setPending(true);
    try {
      const result = await allauth.logout();
      if (result.kind === "error") {
        toast.error(result.formError ?? "We couldn’t log you out. Try again.");
        return;
      }
      queryClient.setQueryData(sessionQueryKey, null);
      await queryClient.invalidateQueries();
      toast.success("You’re logged out.");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("We couldn’t reach TrailVenture to log you out. Try again.");
    } finally {
      setPending(false);
    }
  };

  return { logout, pending };
}
