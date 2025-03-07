import api from "@/api/api";
import { AxiosError } from "axios";
import { toast } from "@/components/Error/ErrorSonner";

export const fetchAdditionalFeesData = async () => {
    try {
      const additionalFees = await api.get(`/apps/transaction/additional-fees/list`);
      return additionalFees.data;
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = err.message;
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
      });
    }
  };