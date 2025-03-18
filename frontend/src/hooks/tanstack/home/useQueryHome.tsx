import { useQuery } from "@tanstack/react-query";
import { fetchHomeDestinationData } from "@/api/homeData";

export const useQueryHome = () => {
  const homeDestinationQuery = useQuery({
    queryKey: ["homeDestination"],
    queryFn: fetchHomeDestinationData,
  });

  return {
    useHomeDestinationQuery: homeDestinationQuery,
  };
};
