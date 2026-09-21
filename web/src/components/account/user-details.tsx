import { ProfileDialog } from "@/components/account/profile-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Account } from "@/lib/account/types";
import { formatApiDate } from "@/lib/format";

/** The original's "User Details": a grid of label | value rows, now editable. */
export function UserDetails({ account }: { account: Account }) {
  const rows = [
    { label: "First Name", value: account.first_name },
    { label: "Last Name", value: account.last_name },
    { label: "Email", value: account.email },
    { label: "Phone", value: account.profile.phone },
    {
      label: "Date of Birth",
      value: account.profile.date_of_birth ? formatApiDate(account.profile.date_of_birth) : "",
    },
    { label: "Member Since", value: formatApiDate(account.date_joined.slice(0, 10)) },
  ];

  return (
    <section aria-labelledby="details-title" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="details-title" className="type-card-title">
          User Details
        </h2>
        <ProfileDialog account={account} />
      </div>
      <dl className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4 rounded-2xl border p-4 sm:p-5">
            <dt className="w-32 shrink-0 border-r pr-4 type-ui text-muted-foreground">
              {row.label}
            </dt>
            <dd className="min-w-0 truncate type-ui font-medium">{row.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function UserDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading your details">
      <Skeleton className="h-7 w-40" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-[74px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
