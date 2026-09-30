import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ISellerOrder, PaginatedResponse } from "@/types";

export const useGetOrders = (filters?: { page: number; limit: number }) => {
  const getOrders = async (): Promise<PaginatedResponse<ISellerOrder>> => {
    const queryString = buildQueryString({ ...filters });
    const response = await API.get(
      `/orders/seller/my-sales${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["seller-orders", filters],
    queryFn: getOrders,
  });
};
