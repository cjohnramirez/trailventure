import { AxiosError } from "axios";
import api from "@/api/api";

export const fetchOwnPackageReviews = async (id : number) => {
  try {
    const fetchPackageReviews = await api.get(`apps/transaction/own-review/list/${id}/`);
    return fetchPackageReviews.data;
  } catch (error) {
    const err = error as AxiosError;
    let errorMessage = "An unexpected error occurred.";

    if (err.response) {
      errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
    } else if (err.request) {
      errorMessage = "Network error: Unable to reach the server. Please check your internet connection.";
    } else {
      errorMessage = err.message;
    }
  }

  return [];
};