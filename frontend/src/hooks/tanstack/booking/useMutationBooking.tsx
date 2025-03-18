import { useMutation } from "@tanstack/react-query";
import { postBookingData, postCheckoutData, postDeletedBooking } from "@/api/bookingData";

const useMutationBooking = () => {
  const useCheckoutMutation = () => {
    return useMutation({
      mutationFn: postCheckoutData,
    });
  };

  const useBookingMutation = () =>
    useMutation({
      mutationFn: postBookingData,
    });

  // Post Deleted Booking
  const useDeleteBookingMutation = (id: number) =>
    useMutation({
      mutationFn: () => postDeletedBooking(id),
    });

  return {
    useCheckoutMutation,
    useBookingMutation,
    useDeleteBookingMutation,
  };
};
export default useMutationBooking;
