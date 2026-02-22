import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const getCategories = async () => {
    const response = await API.get(`/categories`);
    return response.data;
  };

  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
