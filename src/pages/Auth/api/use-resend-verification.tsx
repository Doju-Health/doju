import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthApiError, getAuthErrorMessage } from "../utils";

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await API.post("/auth/resend-verification", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification code sent to your email");
    },
    onError: (error: AuthApiError) => {
      toast.error(`Failed to resend code: ${getAuthErrorMessage(error)}`);
    },
  });
};
