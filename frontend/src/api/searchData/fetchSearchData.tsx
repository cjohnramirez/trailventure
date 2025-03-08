import api from "@/api/api";
import { AxiosError } from "axios";
import { toast } from "@/components/Error/ErrorSonner";
import { searchQuery } from "@/lib/SearchPage/searchQuery";

export const fetchSearchData = async (props : searchQuery) => {
    try {
      const searchData = await api.get(`/apps/package/${props.destination}/${props.start_date}/${props.end_date}/${props.min_price}/${props.max_price}/`);
      return searchData.data || [];
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

    return [];
}