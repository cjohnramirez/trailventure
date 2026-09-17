import { cn } from "@/lib/utils";

/** The original home section heading: large condensed title with a short subheading. */
export function SectionHeading({
  id,
  title,
  subtitle,
  className,
}: {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header
      className={cn("flex flex-col items-center gap-3 pb-10 text-center md:pb-14", className)}
    >
      <h2 id={id} className="type-section-title">
        {title}
      </h2>
      {subtitle ? <p className="type-body font-medium text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}
