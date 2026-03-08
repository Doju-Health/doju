import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { CategoryDetail } from "@/types";

export const useGetACategory = (id: string) => {
  const getACategory = async (): Promise<CategoryDetail> => {
    const response = await API.get(`/categories/${id}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["category", id],
    queryFn: getACategory,
    enabled: !!id,
  });
};
