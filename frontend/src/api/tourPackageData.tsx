import api from "@/api/api";
import { tourPackage } from "@/lib/TourPackagePage/tourPackage";
import { CreateComment } from "@/lib/TourPackagePage/tourPackageCreateReview";
import { tourPackageReviews } from "@/lib/TourPackagePage/tourPackageReview";

export const fetchPackageReviews = async (id: number): Promise<tourPackageReviews[]> => {
  const fetchPackageReviews = await api.get(`apps/transaction/review/list/${id}/`);
  return fetchPackageReviews.data || [];
};

export const fetchPackage = async (id: number): Promise<tourPackage[]> => {
  const fetchPkg = await api.get(`apps/package/${id}/`);
  return fetchPkg.data || [];
};

export const fetchOwnPackageReviews = async (id: number): Promise<tourPackageReviews[]> => {
  const fetchPackageReviews = await api.get(`apps/transaction/own-review/list/${id}/`);
  return fetchPackageReviews.data || [];
};

export const fetchTransactions = async (id: number) => {
  const fetchTransactions = await api.get(`apps/transaction/transaction/list-create/${id}/`);
  return fetchTransactions.data || [];
};

export const fetchTransactionsByBooking = async (id: number) => {
  const fetchTransactionsByBooking = await api.get(
    `apps/transaction/transaction/booking/list-create/${id}/`,
  );
  return fetchTransactionsByBooking.data || [];
};

export const postComment = async (comment: CreateComment) => {
  try {
    const response = await api.post(
      `/apps/transaction/review/create/`,
      {
        comment: comment.comment,
        rating: comment.rating,
        transaction: comment.transaction,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data || [];
  } catch (error) {
    const err = error as any;
    if (err.response) {
      return { status: err.response.status, data: err.response.data };
    } else {
      throw err;
    }
  }
};
