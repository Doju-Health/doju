import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminDashboardStats = () => {
  const getAdminDashboardStats = async () => {
    const response = await API.get(`/admin/dashboard/stats`);
    return response.data;
  };

  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });
};
