import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await API.post("/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset link sent.");
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
