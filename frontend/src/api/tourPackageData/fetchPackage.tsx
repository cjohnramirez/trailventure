import { AxiosError } from "axios";
import { toast } from "@/components/Error/ErrorSonner";
import api from "@/api/api";

export const fetchPackage = async (id : number) => {
  try {
    const fetchPkg = await api.get(`apps/package/${id}/`);
    return fetchPkg.data;
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

    toast({
      title: "Error",
      description: errorMessage,
    });

    throw new Error(errorMessage);
  }
};