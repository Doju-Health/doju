import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInviteAdmin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; fullName: string }) => {
      const response = await API.post("/admin/invite", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Admin invitation sent successfully.");
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
