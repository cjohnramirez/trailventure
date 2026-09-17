import { ImageIcon } from "lucide-react";

import { CatalogImage } from "@/components/app/catalog-image";
import { PhotoCredit } from "@/components/app/photo-credit";
import type { PhotoSlot } from "@/lib/photos";
import { cn } from "@/lib/utils";

type SlotPhotoProps = {
  photo: PhotoSlot;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Where the placeholder icon sits; move it aside when text overlays the center. */
  placeholderIconClassName?: string;
  /** Where the photo credit chip sits. */
  creditClassName?: string;
};

/** Fills its (relatively positioned) parent with the slot's photo, or a neutral placeholder. */
export function SlotPhoto({
  photo,
  sizes,
  priority,
  className,
  placeholderIconClassName,
  creditClassName = "absolute right-3 bottom-3",
}: SlotPhotoProps) {
  if (!photo.src) {
    return (
      <div
        role="img"
        aria-label={`${photo.alt} (photo coming soon)`}
        className={cn("absolute inset-0 flex items-center justify-center bg-muted", className)}
      >
        <ImageIcon
          aria-hidden="true"
          className={cn("size-10 text-muted-foreground/60", placeholderIconClassName)}
        />
      </div>
    );
  }
  return (
    <>
      <CatalogImage
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
      {photo.credit ? (
        <PhotoCredit
          name={photo.credit.name}
          url={photo.credit.url}
          tone="overlay"
          className={creditClassName}
        />
      ) : null}
    </>
  );
}
