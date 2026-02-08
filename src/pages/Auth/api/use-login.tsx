import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { setStoredTokens } from "@/lib/local-storage";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await API.post("/auth/mentor-login", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setStoredTokens(data.access_token, data.refresh_token);
      toast.success("Login Successful.");
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
