import api from "@/api/api";

export const fetchUserReviews = async () => {
  const fetchUserReviews = await api.get(`apps/transaction/own-all-review/list/`);
  return fetchUserReviews.data || [];
};

export const fetchUserData = async () => {
  const response = await api.get(`/apps/users/customer/profile/`);
  return response.data;
};

export const fetchUserBooking = async () => {
  const fetchUserBooking = await api.get(`/apps/transaction/booking/list/`);
  return fetchUserBooking.data || [];
};