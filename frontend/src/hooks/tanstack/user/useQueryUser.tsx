import { useQuery } from "@tanstack/react-query";
import { fetchUserBooking, fetchUserData, fetchUserReviews } from "@/api/userData";

export const useQueryUser = () => {
  // Fetch User Reviews
  const userReviewsQuery = useQuery({
    queryKey: ["userReviews"],
    queryFn: fetchUserReviews,
  });

  // Fetch User Data
  const userDataQuery = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  // Fetch User Booking
  const userBookingQuery = useQuery({
    queryKey: ["userBooking"],
    queryFn: fetchUserBooking,
  });

  return { userReviewsQuery, userDataQuery, userBookingQuery };
};
