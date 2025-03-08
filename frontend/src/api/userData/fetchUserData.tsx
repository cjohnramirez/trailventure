import { AxiosError } from "axios";
import api from "@/api/api";

export const fetchUserData = async () => {
  try {
    const response = await api.get(`/apps/users/customer/profile/`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    let errorMessage = "An unexpected error occurred.";

    if (err.response) {
      errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
    } else if (err.request) {
      errorMessage =
        "Network error: Unable to reach the server. Please check your internet connection.";
    }
  }

  return [];
};
