import { useQuery } from "@tanstack/react-query";
import {
  fetchAdditionalFeesData,
  fetchSingleBooking,
  fetchSuccessfulTransaction,
} from "@/api/bookingData";
import { fetchPackage } from "@/api/tourPackageData";

// Fetch Package Data
export const usePackageQuery = (id: number) =>
  useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackage(id),
  });

// Fetch Additional Fees Data
export const useAdditionalFeesQuery = () =>
  useQuery({
    queryKey: ["additionalFees"],
    queryFn: () => fetchAdditionalFeesData(),
  });

// Fetch Single Booking
export const useSingleBookingQuery = (id: number) =>
  useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchSingleBooking(id),
  });

// Fetch Successful Transaction
export const useSuccessfulTransactionQuery = (id: number) =>
  useQuery({
    queryKey: ["transaction", id],
    queryFn: () => fetchSuccessfulTransaction(id),
  });
