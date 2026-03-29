import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FilterProps } from "@/types";

export const useGetSellerProducts = (id: string, filters?: FilterProps) => {
  const getSellerProducts = async () => {
    const queryString = buildQueryString({ ...filters });
    const response = await API.get( 
      `/admin/sellers/${id}/products${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["seller-products", id, filters],
    queryFn: getSellerProducts,
  });
};
