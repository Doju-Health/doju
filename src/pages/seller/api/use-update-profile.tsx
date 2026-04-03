import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fullName?: string;
      phoneNumber?: string;
      address?: string;
      companyName?: string;
      licenseNumber?: string;
      profileImageUrl?: string;
      cacUrl?: string;
      ninUrl?: string;
    }) => {
      const response = await API.patch("users/profile", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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
