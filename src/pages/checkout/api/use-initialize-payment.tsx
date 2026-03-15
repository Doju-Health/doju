import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: async (data: { bulkOrderId: string; callbackUrl: string }) => {
      const response = await API.post("/payments/initialize", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Payment Initialized Successfully.");
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
