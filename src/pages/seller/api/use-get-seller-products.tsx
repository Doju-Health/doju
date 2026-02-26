import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetSellersProducts = (filters?: {
  page: number;
  limit: number;
}) => {
  const getSellersProducts = async () => {
    const queryString = buildQueryString({ ...filters });
    const response = await API.get(
      `/products/me${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["sellersProducts", filters],
    queryFn: getSellersProducts,
    enabled: !!filters,
  });
};
