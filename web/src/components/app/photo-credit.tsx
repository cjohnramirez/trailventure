import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/** "Photo by … on Unsplash", linked as the Unsplash API guidelines require. */
export function PhotoCredit({
  photo,
  className,
  tone = "default",
}: {
  photo: Photo;
  className?: string;
  /** `overlay`: light text for use on top of the photo. */
  tone?: "default" | "overlay";
}) {
  const link = cn(
    "underline underline-offset-2",
    tone === "overlay" ? "hover:text-white" : "hover:text-foreground",
  );
  return (
    <p
      className={cn(
        "text-xs",
        tone === "overlay"
          ? "rounded-full bg-black/45 px-2.5 py-1 text-white/90"
          : "text-muted-foreground",
        className,
      )}
    >
      Photo by{" "}
      <a href={photo.photographerUrl} className={link} target="_blank" rel="noopener noreferrer">
        {photo.photographer}
      </a>{" "}
      on{" "}
      <a href={photo.unsplashUrl} className={link} target="_blank" rel="noopener noreferrer">
        Unsplash
      </a>
    </p>
  );
}
