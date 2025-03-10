import api from "@/api/api";
import { CreateComment } from "@/lib/TourPackagePage/tourPackageCreateReview";

export const fetchPackageReviews = async (id: number) => {
  const fetchPackageReviews = await api.get(`apps/transaction/review/list/${id}/`);
  return fetchPackageReviews.data || [];
};

export const fetchPackage = async (id: number) => {
  const fetchPkg = await api.get(`apps/package/${id}/`);
  return fetchPkg.data || [];
};

export const fetchOwnPackageReviews = async (id: number) => {
  const fetchPackageReviews = await api.get(`apps/transaction/own-review/list/${id}/`);
  return fetchPackageReviews.data || [];
};

export const fetchTransactions = async () => {
  const fetchTransactions = await api.get(`apps/transaction/transaction/list-create/`);
  return fetchTransactions.data || [];
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
