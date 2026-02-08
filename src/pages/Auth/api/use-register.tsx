import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { setStoredTokens } from "@/lib/local-storage";
import { SignupData } from "@/types";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await API.post("/auth/register", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Don't set tokens immediately - wait for email verification
      // The email verification will be handled in the Auth component
      toast.success("Verification code sent to your email");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message: string;
      error: string;
    }) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || error?.error;
      toast.error(`Registration failed: ${errorMessage}`);
    },
  });
};
