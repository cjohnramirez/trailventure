import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type ResultDetail = { label: string; value: string };

/**
 * The original result page: a centered card with a large status icon, a headline and a 2x2 grid
 * of transaction details. The icon color is the only difference between success and cancelled.
 */
export function BookingResultCard({
  icon,
  tone,
  title,
  description,
  details,
  children,
}: {
  icon: React.ReactNode;
  tone: "brand" | "destructive";
  title: string;
  description: string;
  details?: ResultDetail[];
  children?: React.ReactNode;
}) {
  return (
    <Card className="mx-auto w-full max-w-2xl rounded-2xl">
      <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
        <div
          className={cn("[&_svg]:size-12", tone === "brand" ? "text-brand" : "text-destructive")}
          aria-hidden
        >
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="type-heading">{title}</h1>
          <p className="type-body text-muted-foreground">{description}</p>
        </div>
        {details?.length ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex flex-col gap-1 rounded-xl border bg-surface-muted p-4"
              >
                <dt className="type-caption text-muted-foreground">{detail.label}</dt>
                <dd className="type-ui font-medium break-words">{detail.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children ? <div className="flex flex-col gap-4">{children}</div> : null}
      </CardContent>
    </Card>
  );
}

export function BookingResultSkeleton({ label }: { label: string }) {
  return (
    <Card className="mx-auto w-full max-w-2xl rounded-2xl">
      <CardContent className="flex flex-col gap-6 p-6 sm:p-8" role="status" aria-label={label}>
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
