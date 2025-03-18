import api from "@/api/api";
import { Booking } from "@/lib/BookingPage/booking";
import { tourPackageReviews } from "@/lib/TourPackagePage/tourPackageReview";
import { UserData } from "@/lib/UserPage/userData";

export const fetchUserReviews = async (): Promise<tourPackageReviews[]> => {
  const fetchUserReviews = await api.get(`apps/transaction/own-all-review/list/`);
  console.log(fetchUserReviews);
  return fetchUserReviews.data || [];
};

export const fetchUserData = async (): Promise<UserData[]> => {
  const response = await api.get(`/apps/users/customer/profile/`);
  return response.data;
};

export const fetchUserBooking = async (): Promise<Booking[]> => {
  const fetchUserBooking = await api.get(`/apps/transaction/booking/list/`);
  return fetchUserBooking.data || [];
};
