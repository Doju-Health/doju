import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVerifyBank = () => {
  return useMutation({
    mutationFn: async (data: { accountNumber: string; bankCode: string }) => {
      const response = await API.post(`/payments/banks/verify`, data);
      return response.data;
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
