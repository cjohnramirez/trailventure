/** Booking shapes from the API (api/apps/bookings/serializers.py). Amounts are centavos. */

export type Quote = {
  unit_price: number;
  guests: number;
  base_amount: number;
  site_fee_amount: number;
  tax_amount: number;
  total_amount: number;
  tax_percent: string;
  site_fee_percent: string;
};

export type BookingStatus = "pending_payment" | "confirmed" | "expired" | "cancelled" | "refunded";

export type Booking = {
  id: string;
  status: BookingStatus;
  package: {
    slug: string;
    name: string;
    address: string;
    cover: { url: string; alt: string } | null;
  };
  tier: { id: number; name: string };
  start_date: string;
  guests: number;
  unit_price: number;
  base_amount: number;
  site_fee_amount: number;
  tax_amount: number;
  total_amount: number;
  tax_percent: string;
  site_fee_percent: string;
  hold_expires_at: string;
  is_hold_active: boolean;
  confirmed_at: string | null;
  created_at: string;
};
