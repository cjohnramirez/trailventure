const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/** Formats whole pesos, e.g. 12000 -> "₱12,000". */
export function formatPeso(amount: number): string {
  return pesoFormatter.format(amount);
}

/** Formats an API amount in centavos, e.g. 1200000 -> "₱12,000". */
export function formatCentavos(centavos: number): string {
  return pesoFormatter.format(centavos / 100);
}

const shortDate = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" });

/** Formats a date range for compact labels, e.g. "Oct 1 – Oct 10". */
export function formatDateRange(from?: Date, to?: Date): string | null {
  if (!from) return null;
  if (!to) return shortDate.format(from);
  return `${shortDate.format(from)} – ${shortDate.format(to)}`;
}

/** Formats a Date as a local calendar date (YYYY-MM-DD) without timezone shifts. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Formats an API time ("08:00:00") for display, e.g. "8:00 AM". */
export function formatTime(value: string | null): string | null {
  if (!value) return null;
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
