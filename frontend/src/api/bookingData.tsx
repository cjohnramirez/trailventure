import api from "@/api/api";
import { PostBooking } from "@/lib/BookingPage/postBooking";

export const getPackageData = async (id: number) => {
  const fetchPkg = await api.get(`apps/package/${id}/`);
  return fetchPkg.data || [];
};

export const postCheckoutData = async (bookingId: number) => {
  const response = await api.post(`/apps/transaction/checkout/session/${bookingId}/`);
  window.location.href = response.data.url;
};

export const postBookingData = async (userBooking: PostBooking) => {
  try {
    const response = await api.post(
      `/apps/transaction/booking/list-create/`,
      {
        num_of_person: userBooking.num_of_person,
        currency: userBooking.currency,
        package_type: userBooking.package_type,
        user: userBooking.user,
        start_date: userBooking.start_date,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const fetchAdditionalFeesData = async () => {
  const additionalFees = await api.get(`/apps/transaction/additional-fees/list/`);
  return additionalFees.data || [];
};

export const postDeletedBooking = async (id: number) => {
  try {
    const response = await api.get(`/apps/transaction/booking/cancelled/${id}/`);
    return response.data || [];
  } catch (error) {
    console.error("Error:", error);
  }

  return [];
};
