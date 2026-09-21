"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api/client";

export type Role = "traveler" | "host" | "admin";

export type SessionUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: Role;
  email_verified: boolean;
};

export const sessionQueryKey = ["session"] as const;

async function fetchSession(): Promise<SessionUser | null> {
  const response = await apiRequest("/api/v1/auth/me/");
  if (!response.ok) throw new Error(`Session request failed (${response.status})`);
  const body = (await response.json()) as { user: SessionUser | null };
  return body.user;
}

/** The signed-in user (`null` when signed out). Backed by /api/v1/auth/me/, which never 401s. */
export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useRefreshSession() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: sessionQueryKey });
}
