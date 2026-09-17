import { cn } from "@/lib/utils";

/** "Photo: {name} / Unsplash", linked as the Unsplash API guidelines require. */
export function PhotoCredit({
  name,
  url,
  className,
  tone = "default",
}: {
  name: string;
  url: string;
  className?: string;
  /** `overlay`: light text on a translucent chip, for use on top of the photo. */
  tone?: "default" | "overlay";
}) {
  if (!name) return null;
  return (
    <p
      className={cn(
        "text-xs",
        tone === "overlay"
          ? "rounded-full bg-black/50 px-2.5 py-1 text-white"
          : "text-muted-foreground",
        className,
      )}
    >
      Photo by{" "}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        {name}
      </a>{" "}
      on{" "}
      <a
        href="https://unsplash.com/?utm_source=trailventure&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        Unsplash
      </a>
    </p>
  );
}
