import { useQuery } from "@tanstack/react-query";
import { searchQuery } from "@/lib/SearchPage/searchQuery";
import { fetchDestinationData, fetchSearchData } from "@/api/searchData";

// Fetch Search Data
export const useSearchQuery = (props: searchQuery) =>
  useQuery({
    queryKey: ["searchResults", props],
    queryFn: () => fetchSearchData(props),
  });

// Fetch Destination Data
export const useDestinationQuery = () =>
  useQuery({
    queryKey: ["destinations"],
    queryFn: fetchDestinationData,
  });
