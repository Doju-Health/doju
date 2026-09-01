import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { IProductData, PaginatedResponse } from "@/types";

export const useGetAdminProducts = (filters?: {
  page?: number;
  limit?: number;
}) => {
  const getAdminProducts = async () => {
    const queryString = buildQueryString({ ...filters });
    const response: { data: PaginatedResponse<IProductData> } = await API.get(
      `/products${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: getAdminProducts,
    enabled: !!filters,
  });
};
