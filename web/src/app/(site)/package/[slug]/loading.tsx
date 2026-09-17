import { Skeleton } from "@/components/ui/skeleton";

export default function PackageLoading() {
  return (
    <div
      role="status"
      aria-label="Loading package"
      className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 pt-8 pb-28 sm:px-8"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl sm:h-96" />
        <Skeleton className="hidden h-96 rounded-2xl md:block" />
        <Skeleton className="hidden h-96 rounded-2xl lg:block" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <Skeleton className="h-[28rem] rounded-2xl" />
      </div>
    </div>
  );
}
