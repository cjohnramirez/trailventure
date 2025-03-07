import { create } from "zustand";
import api from "@/api/api";
import { Booking } from "@/lib/BookingPage/booking";

interface PostStore {
  loading: boolean;
  booking: Booking | null;
  setBooking: (booking: PostBookingProps) => Promise<void>;
  startCheckout: (bookingId: number) => Promise<void>;
}

interface PostBookingProps {
  num_of_person: number;
  currency: string;
  package_type: number;
  user: number;
}

export const usePostStore = create<PostStore>((set) => ({
  loading: false,
  booking: null,
  setBooking: async (userBooking: PostBookingProps) => {
    try {
      set({ loading: true });
      const response = await api.post(
        `/apps/transaction/booking/list-create`,
        {
          num_of_person: userBooking.num_of_person,
          currency: userBooking.currency,
          package_type: userBooking.package_type,
          user: userBooking.user,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      set({ booking: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
    return;
  },

  startCheckout: async (bookingId: number) => {
    try {
      const response = await api.post(`/apps/transaction/checkout/session/${bookingId}/`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout session error:", error);
    }
  },
}));
