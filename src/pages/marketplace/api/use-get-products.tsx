import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ApiProduct, PaginatedResponse } from "@/types";

export const useGetProducts = (filters?: { page?: number; limit?: number }) => {
  const getProducts = async (): Promise<PaginatedResponse<ApiProduct>> => {
    const queryString = buildQueryString({ ...filters });
    const response = await API.get(
      `/products${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["products", filters],
    queryFn: getProducts,
  });
};
