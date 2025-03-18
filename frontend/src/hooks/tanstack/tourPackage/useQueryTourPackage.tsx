import { useQuery } from "@tanstack/react-query";
import {
  fetchOwnPackageReviews,
  fetchPackage,
  fetchPackageReviews,
  fetchTransactions,
  fetchTransactionsByBooking,
} from "@/api/tourPackageData";

export const useQueryTourPackage = () => {
  // Fetch Package Reviews
  const usePackageReviewsQuery = (id: number) =>
    useQuery({
      queryKey: ["packageReviews", id],
      queryFn: () => fetchPackageReviews(id),
    });

  // Fetch Package
  const usePackageQuery = (id: number) =>
    useQuery({
      queryKey: ["package", id],
      queryFn: () => fetchPackage(id),
    });

  // Fetch Own Package Reviews
  const useOwnPackageReviewsQuery = (id: number) =>
    useQuery({
      queryKey: ["ownPackageReviews", id],
      queryFn: () => fetchOwnPackageReviews(id),
    });

  // Fetch Transactions
  const useTransactionsQuery = (id: number) =>
    useQuery({
      queryKey: ["transactions", id],
      queryFn: () => fetchTransactions(id),
    });

  // Fetch Transactions by Booking
  const useTransactionsByBookingQuery = (id: number) =>
    useQuery({
      queryKey: ["transactionsByBooking", id],
      queryFn: () => fetchTransactionsByBooking(id),
    });

  return {
    usePackageReviewsQuery,
    usePackageQuery,
    useOwnPackageReviewsQuery,
    useTransactionsQuery,
    useTransactionsByBookingQuery,
  };
};
