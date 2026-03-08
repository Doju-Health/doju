import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await API.patch(`/orders/${orderId}/complete`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Order completed successfully.");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
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
