import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { setStoredTokens } from "@/lib/local-storage";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await API.post("/auth/verify-email", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Set tokens after successful email verification
      if (data?.access_token && data?.refresh_token) {
        setStoredTokens(data.access_token, data.refresh_token);
      }
      toast.success("Email verified! Welcome to DOJU");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message: string;
      error: string;
    }) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || error?.error;
      toast.error(`Verification failed: ${errorMessage}`);
    },
  });
};
