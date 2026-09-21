import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCentavos } from "@/lib/format";

type Amounts = {
  guests: number;
  base_amount: number;
  site_fee_amount: number;
  tax_amount: number;
  total_amount: number;
  tax_percent: string;
  site_fee_percent: string;
};

function Row({ label, hint, value }: { label: string; hint?: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="type-ui text-muted-foreground">
        {label}
        {hint ? <span className="block type-caption">{hint}</span> : null}
      </span>
      <span className="type-ui font-medium tabular-nums">{value}</span>
    </div>
  );
}

/** The original invoice rows: people, base price, site fees, tax fees, total. */
export function PriceBreakdown({ amounts }: { amounts: Amounts }) {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Number of people" value={`× ${amounts.guests}`} />
      <Row label="Base price" value={formatCentavos(amounts.base_amount)} />
      <Row
        label="Site fees"
        hint={`${Number(amounts.site_fee_percent)}% of the base price`}
        value={formatCentavos(amounts.site_fee_amount)}
      />
      <Row
        label="Tax fees"
        hint={`Includes VAT and tourism tax (${Number(amounts.tax_percent)}%)`}
        value={formatCentavos(amounts.tax_amount)}
      />
      <Separator />
      <div className="flex items-baseline justify-between gap-4">
        <span className="type-body font-semibold">Total price</span>
        <span className="type-heading tabular-nums">{formatCentavos(amounts.total_amount)}</span>
      </div>
    </div>
  );
}

export function PriceBreakdownSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Calculating price">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
      <Separator />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-7 w-32" />
      </div>
    </div>
  );
}
