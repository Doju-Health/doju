import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRejectSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; reason: string }) => {
      const response = await API.patch(`/admin/sellers/${data.id}/reject`, {
        reason: data.reason,
      });
      return response.data;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Seller rejected successfully.");
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
