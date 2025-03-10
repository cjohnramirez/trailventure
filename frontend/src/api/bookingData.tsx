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
};

export const fetchAdditionalFeesData = async () => {
  const additionalFees = await api.get(`/apps/transaction/additional-fees/list`);
  return additionalFees.data || [];
};