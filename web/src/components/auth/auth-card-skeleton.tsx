import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder with the auth card's shape while search params resolve. */
export function AuthCardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="grid w-full max-w-[56rem] gap-3 rounded-2xl border p-3 md:grid-cols-2"
    >
      <Skeleton className="hidden min-h-[36rem] rounded-xl md:block" />
      <div className="flex flex-col justify-center gap-5 px-5 py-8 sm:px-10">
        <Skeleton className="mx-auto h-7 w-48" />
        <Skeleton className="mx-auto h-4 w-56" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
