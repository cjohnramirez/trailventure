import { useQuery } from "@tanstack/react-query";
import {
  fetchOwnPackageReviews,
  fetchPackage,
  fetchPackageReviews,
  fetchTransactions,
  fetchTransactionsByBooking,
} from "@/api/tourPackageData";

// Fetch Package Reviews
export const usePackageReviewsQuery = (id: number) =>
  useQuery({
    queryKey: ["packageReviews", id],
    queryFn: () => fetchPackageReviews(id),
  });

// Fetch Package
export const usePackageQuery = (id: number) =>
  useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackage(id),
  });

// Fetch Own Package Reviews
export const useOwnPackageReviewsQuery = (id: number) =>
  useQuery({
    queryKey: ["ownPackageReviews", id],
    queryFn: () => fetchOwnPackageReviews(id),
  });

// Fetch Transactions
export const useTransactionsQuery = (id: number) =>
  useQuery({
    queryKey: ["transactions", id],
    queryFn: () => fetchTransactions(id),
  });

// Fetch Transactions by Booking
export const useTransactionsByBookingQuery = (id: number) =>
  useQuery({
    queryKey: ["transactionsByBooking", id],
    queryFn: () => fetchTransactionsByBooking(id),
  });
