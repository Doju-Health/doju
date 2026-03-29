import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FilterProps, PaginatedBuyerOrdersData } from "@/types";

export const useGetBuyerOrders = (id: string, filters?: FilterProps) => {
  const getBuyerOrders = async () => {
    const queryString = buildQueryString({ ...filters });
    const response: { data: PaginatedBuyerOrdersData } = await API.get( 
      `/admin/buyers/${id}/orders${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["buyer-orders", id, filters],
    queryFn: getBuyerOrders,
  });
};
