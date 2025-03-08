import api from "@/api/api";
import { PostBooking } from "@/lib/BookingPage/postBooking";
import { AxiosError } from "axios";

export const postBookingData = async (userBooking: PostBooking) => {
  try {
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
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err);
  }
  return;
};
