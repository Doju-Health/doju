import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardRevenueCharts = (months: number) => {
  const getDashboardRevenueCharts = async () => {
    const response = await API.get(
      `/seller/dashboard/revenue-chart?months=${months}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["revenue-charts", months],
    queryFn: getDashboardRevenueCharts,
  });
};
