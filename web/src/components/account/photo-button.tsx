"use client";

import { ImageUpIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api/client";
import { useRemovePhoto, useUploadPhoto } from "@/lib/account/use-account";
import type { PhotoKind } from "@/lib/account/types";

const MAX_BYTES = 5 * 1024 * 1024;

/** Picks an image and uploads it straight to Cloudinary, or clears the current one. */
export function PhotoButton({
  kind,
  label,
  hasPhoto,
  className,
}: {
  kind: PhotoKind;
  label: string;
  hasPhoto: boolean;
  className?: string;
}) {
  const input = React.useRef<HTMLInputElement>(null);
  const upload = useUploadPhoto();
  const remove = useRemovePhoto();
  const busy = upload.isPending || remove.isPending;

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("That image is larger than 5 MB.");
      return;
    }
    upload.mutate(
      { kind, file },
      {
        onSuccess: () => toast.success(`${label} updated.`),
        onError: (cause) =>
          toast.error(
            cause instanceof ApiError
              ? cause.message
              : `We couldn’t upload your ${label.toLowerCase()}.`,
          ),
      },
    );
  };

  return (
    <div className={className}>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={`Upload a new ${label.toLowerCase()}`}
        onChange={onPick}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-busy={busy}
        >
          {upload.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <ImageUpIcon data-icon="inline-start" />
          )}
          {hasPhoto ? `Change ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
        </Button>
        {hasPhoto ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Remove ${label.toLowerCase()}`}
            onClick={() =>
              remove.mutate(kind, {
                onSuccess: () => toast.success(`${label} removed.`),
                onError: () => toast.error(`We couldn’t remove your ${label.toLowerCase()}.`),
              })
            }
            disabled={busy}
          >
            {remove.isPending ? <Spinner /> : <Trash2Icon />}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
