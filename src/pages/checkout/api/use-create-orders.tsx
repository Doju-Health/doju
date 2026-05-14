import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: {
      productIds: string[];
      quantities: number[];
      deliveryAddress: string;
      note?: string;
      deliveryCity?: string;
      deliveryState?: string;
    }) => {
      const response = await API.post("/orders/bulk", data);
      return response.data as {
        orderId: string;
        totalPrice: number;
        orders: any[];
      };
    },
    onSuccess: () => {
      toast.success("Order Created Successfully.");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message: string;
      error: string;
    }) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || error?.error;
      toast.error(`Failed: ${errorMessage}`);
    },
  });
};
