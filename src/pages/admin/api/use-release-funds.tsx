import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReleaseFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { orderId: string }) => {
      const response = await API.post(`/payments/${data.orderId}/release`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      toast.success("Funds released successfully.");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message: string;
      error?: string;
    }) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || error?.error;
      toast.error(`Failed: ${errorMessage}`);
    },
  });
};
