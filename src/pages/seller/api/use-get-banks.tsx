import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetBanks = () => {
  const getBanks = async () => {
    const response = await API.get(`payments/banks`);
    return response.data;
  };

  return useQuery({
    queryKey: ["banks"],
    queryFn: getBanks,
  });
};
