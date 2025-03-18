import { useQuery } from "@tanstack/react-query";
import { fetchHomeDestinationData } from "@/api/homeData";

// Fetch Home Destination Data
export const useHomeDestinationQuery = () =>
  useQuery({
    queryKey: ["homeDestination"],
    queryFn: fetchHomeDestinationData,
  });
