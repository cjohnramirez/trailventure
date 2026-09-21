"use client";

import { ApiError, apiRequest } from "@/lib/api/client";
import { readApiError } from "@/lib/api/errors";

import type { Account, PhotoKind, ProfilePatch, UploadSignature } from "./types";

export async function fetchAccount(): Promise<Account> {
  const response = await apiRequest("/api/v1/auth/account/");
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Account;
}

export async function updateAccount(patch: ProfilePatch): Promise<Account> {
  const response = await apiRequest("/api/v1/auth/account/", { method: "PATCH", json: patch });
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Account;
}

async function requestUploadSignature(kind: PhotoKind): Promise<UploadSignature> {
  const response = await apiRequest("/api/v1/auth/account/photo/signature/", {
    method: "POST",
    json: { kind },
  });
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as UploadSignature;
}

/**
 * Uploads straight from the browser to Cloudinary with a signature from our API, then tells the
 * API which version to show. The image bytes never pass through the Django service.
 */
export async function uploadProfilePhoto(kind: PhotoKind, file: File): Promise<Account> {
  const signature = await requestUploadSignature(kind);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.api_key);
  form.append("timestamp", String(signature.timestamp));
  form.append("public_id", signature.public_id);
  form.append("overwrite", signature.overwrite);
  form.append("invalidate", signature.invalidate);
  form.append("signature", signature.signature);

  const upload = await fetch(signature.upload_url, { method: "POST", body: form });
  if (!upload.ok) throw new ApiError("Cloudinary wouldn’t accept that image.", upload.status);
  const { version } = (await upload.json()) as { version: number };

  const response = await apiRequest("/api/v1/auth/account/photo/", {
    method: "POST",
    json: { kind, version },
  });
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Account;
}

export async function removeProfilePhoto(kind: PhotoKind): Promise<Account> {
  const response = await apiRequest("/api/v1/auth/account/photo/", {
    method: "DELETE",
    json: { kind },
  });
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as Account;
}

export async function fetchCapabilities(): Promise<{ photo_uploads: boolean }> {
  const response = await apiRequest("/api/v1/auth/capabilities/");
  if (!response.ok) throw new ApiError(await readApiError(response), response.status);
  return (await response.json()) as { photo_uploads: boolean };
}
