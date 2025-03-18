import { useMutation } from "@tanstack/react-query";
import { postBookingData, postCheckoutData, postDeletedBooking } from "@/api/bookingData";

// Post Checkout Data
export const useCheckoutMutation = () =>
  useMutation({
    mutationFn: postCheckoutData,
  });

// Post Booking Data
export const useBookingMutation = () =>
  useMutation({
    mutationFn: postBookingData,
  });

// Post Deleted Booking
export const useDeleteBookingMutation = (id: number) =>
  useMutation({
    mutationFn: () => postDeletedBooking(id),
  });
