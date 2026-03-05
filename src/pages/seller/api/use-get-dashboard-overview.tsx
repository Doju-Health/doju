import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardOverview = () => {
  const getDashboardOverview = async () => {
    const response = await API.get(`/seller/dashboard`);
    return response.data;
  };

  return useQuery({
    queryKey: ["overview"],
    queryFn: getDashboardOverview,
  });
};
