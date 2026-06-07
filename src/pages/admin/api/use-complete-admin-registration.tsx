import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCompleteAdminRegistration = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await API.post("/admin/complete-registration", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account set up successfully. You can now sign in.");
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
