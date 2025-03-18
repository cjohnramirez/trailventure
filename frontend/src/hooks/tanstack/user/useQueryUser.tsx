import { useQuery } from "@tanstack/react-query";
import { fetchUserBooking, fetchUserData, fetchUserReviews } from "@/api/userData";

// Fetch User Reviews
export const useUserReviewsQuery = () =>
  useQuery({
    queryKey: ["userReviews"],
    queryFn: fetchUserReviews,
  });

// Fetch User Data
export const useUserQuery = () =>
  useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

// Fetch User Booking
export const useUserBookingQuery = () =>
  useQuery({
    queryKey: ["userBooking"],
    queryFn: fetchUserBooking,
  });
