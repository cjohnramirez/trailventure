import api from "@/api/api";
import { searchQuery } from "@/lib/SearchPage/searchQuery";

export const fetchSearchData = async (props: searchQuery) => {
  const searchData = await api.get(
    `/apps/package/${props.destination}/${props.start_date}/${props.end_date}/${props.min_price}/${props.max_price}/?page=${props.page}`,
  );
  console.log(searchData.request.responseURL);
  return searchData.data || [];
};

export const fetchDestinationData = async () => {
  const response = await api.get("apps/destination/list/");
  return response.data || [];
};
