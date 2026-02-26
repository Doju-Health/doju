import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiProduct } from "@/types";

export const useGetAProduct = (id: string) => {
  const getAProduct = async (): Promise<ApiProduct> => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["product", id],
    queryFn: getAProduct,
    enabled: !!id,
  });
};
