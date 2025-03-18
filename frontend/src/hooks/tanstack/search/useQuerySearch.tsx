import { useQuery } from "@tanstack/react-query";
import { searchQuery } from "@/lib/SearchPage/searchQuery";
import { fetchDestinationData, fetchSearchData } from "@/api/searchData";

export const useQuerySearch = () => {
  // Fetch Search Data
  const useSearchQuery = (props: searchQuery) =>
    useQuery({
      queryKey: ["searchResults", props],
      queryFn: () => fetchSearchData(props),
    });

  // Fetch Destination Data
  const useDestinationQuery = () =>
    useQuery({
      queryKey: ["destinations"],
      queryFn: fetchDestinationData,
    });

  return { useSearchQuery, useDestinationQuery };
};
