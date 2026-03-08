import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const MAX_IMAGE_SIZE_BYTES = 10485760;

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (payload: File[]) => {
      if (!Array.isArray(payload) || payload.length === 0) {
        throw new Error("Please select at least one image to upload");
      }

      const oversizedFile = payload.find(
        (file) => file.size > MAX_IMAGE_SIZE_BYTES,
      );
      if (oversizedFile) {
        throw new Error(
          `\"${oversizedFile.name}\" exceeds 10MB. Please upload smaller images.`,
        );
      }

      const formData = new FormData();
      payload.forEach((file) => formData.append("files", file));

      const response = await API.post(`/cloudinary/upload-multiple`, formData);

      const urls =
        response?.data?.url || response?.data?.urls || response?.data?.data;

      if (Array.isArray(urls)) {
        return urls;
      }

      if (typeof urls === "string") {
        return [urls];
      }

      throw new Error("Unexpected upload response format");
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
