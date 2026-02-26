import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (payload: File | File[]) => {
      const formData = new FormData();
      if (Array.isArray(payload)) {
        payload.forEach((file) => formData.append("file", file));
      } else {
        formData.append("file", payload);
      }
      const response = await API.post(`/cloudinary/upload`, formData);
      return response.data.url;
    },

    onError: (error: {
      response?: { data?: { message?: string } };
      message: string;
      error: string;
    }) => {
      const errorMessage =
        error.response?.data?.message || error.message || error?.error;
      toast.error(`Failed: ${errorMessage}`);
    },
  });
};
