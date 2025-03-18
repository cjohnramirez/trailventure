import { useQuery } from "@tanstack/react-query";
import {
  fetchAdditionalFeesData,
  fetchSingleBooking,
  fetchSuccessfulTransaction,
} from "@/api/bookingData";
import { fetchPackage } from "@/api/tourPackageData";

export const useQueryBooking = () => {
  // Fetch Package Data
  const usePackageQuery = (id: number) =>
    useQuery({
      queryKey: ["package", id],
      queryFn: () => fetchPackage(id),
    });

  // Fetch Additional Fees Data
  const useAdditionalFeesQuery = () =>
    useQuery({
      queryKey: ["additionalFees"],
      queryFn: () => fetchAdditionalFeesData(),
    });

  // Fetch Single Booking
  const useSingleBookingQuery = (id: number) =>
    useQuery({
      queryKey: ["booking", id],
      queryFn: () => fetchSingleBooking(id),
    });

  // Fetch Successful Transaction
  const useSuccessfulTransactionQuery = (id: number) =>
    useQuery({
      queryKey: ["transaction", id],
      queryFn: () => fetchSuccessfulTransaction(id),
    });

  return {
    usePackageQuery,
    useAdditionalFeesQuery,
    useSingleBookingQuery,
    useSuccessfulTransactionQuery,
  };
};
