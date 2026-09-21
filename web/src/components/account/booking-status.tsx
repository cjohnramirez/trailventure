import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/bookings/types";

const LABELS: Record<
  BookingStatus,
  { label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
  confirmed: { label: "Confirmed", variant: "default" },
  pending_payment: { label: "Awaiting payment", variant: "outline" },
  expired: { label: "Expired", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "secondary" },
  refunded: { label: "Refunded", variant: "secondary" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, variant } = LABELS[status];
  return (
    <Badge variant={variant} className="rounded-full">
      {label}
    </Badge>
  );
}
