import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrders = () => {
  const getOrders = async () => {
    const response = await API.get(`/orders/seller/my-sales`);
    return response.data;
  };

  return useQuery({
    queryKey: ["seller-orders"],
    queryFn: getOrders,
  });
};
