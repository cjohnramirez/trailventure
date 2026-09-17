const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/** Formats whole pesos, e.g. 12000 -> "₱12,000". */
export function formatPeso(amount: number): string {
  return pesoFormatter.format(amount);
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
