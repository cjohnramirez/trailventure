import api from "@/api/api";
export const fetchHomeDestinationData = async () => {
  const homeDestinationData = await api.get(`/apps/destination/list/forhome/`);
  return homeDestinationData.data || [];
};
