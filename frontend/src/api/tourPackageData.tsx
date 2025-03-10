import api from "@/api/api";

export const fetchPackageReviews = async (id: number) => {
  const fetchPackageReviews = await api.get(`apps/transaction/review/list/${id}/`);
  return fetchPackageReviews.data || [];
};

export const fetchPackage = async (id: number) => {
  const fetchPkg = await api.get(`apps/package/${id}/`);
  return fetchPkg.data || [];
};

export const fetchOwnPackageReviews = async (id: number) => {
  const fetchPackageReviews = await api.get(`apps/transaction/own-review/list/${id}/`);
  return fetchPackageReviews.data || [];
};
