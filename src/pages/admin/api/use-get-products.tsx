import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminProducts = (filters?: {
  page: number;
  limit: number;
}) => {
  const getAdminProducts = async () => {
    const queryString = buildQueryString({ ...filters });
    const response = await API.get(
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
