"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sessionQueryKey } from "@/lib/auth/session";

import {
  fetchAccount,
  fetchCapabilities,
  removeProfilePhoto,
  updateAccount,
  uploadProfilePhoto,
} from "./api";
import type { Account, PhotoKind, ProfilePatch } from "./types";

export const accountQueryKey = ["account"] as const;

export function useAccount() {
  return useQuery({ queryKey: accountQueryKey, queryFn: fetchAccount, staleTime: 30_000 });
}

/** Whether photo uploads are available; they need Cloudinary to be configured on the API. */
export function useCapabilities() {
  return useQuery({
    queryKey: ["capabilities"],
    queryFn: fetchCapabilities,
    staleTime: 5 * 60_000,
  });
}

function useAccountWriter<TInput>(write: (input: TInput) => Promise<Account>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: write,
    onSuccess: (account) => {
      queryClient.setQueryData(accountQueryKey, account);
      // The header greets the traveler by name, so refresh the session too.
      void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

export function useUpdateAccount() {
  return useAccountWriter<ProfilePatch>(updateAccount);
}

export function useUploadPhoto() {
  return useAccountWriter<{ kind: PhotoKind; file: File }>(({ kind, file }) =>
    uploadProfilePhoto(kind, file),
  );
}

export function useRemovePhoto() {
  return useAccountWriter<PhotoKind>(removeProfilePhoto);
}
