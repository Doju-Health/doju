import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddBankInfo = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      accountNumber: string;
      bankCode: string;
      accountName: string;
    }) => {
      const response = await API.patch(`/users/bank-info`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Bank added successfully.");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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
