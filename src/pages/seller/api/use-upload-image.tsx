import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosProgressEvent } from "axios";
import { toast } from "sonner";

const MAX_IMAGE_SIZE_BYTES = 10485760;

type UploadImagePayload =
  | File[]
  | {
      files: File[];
      onUploadProgress?: (progress: number) => void;
    };

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (payload: UploadImagePayload) => {
      const files = Array.isArray(payload) ? payload : payload.files;
      const onUploadProgress = Array.isArray(payload)
        ? undefined
        : payload.onUploadProgress;

      if (!Array.isArray(files) || files.length === 0) {
        throw new Error("Please select at least one image to upload");
      }

      const oversizedFile = files.find(
        (file) => file.size > MAX_IMAGE_SIZE_BYTES,
      );
      if (oversizedFile) {
        throw new Error(
          `\"${oversizedFile.name}\" exceeds 10MB. Please upload smaller images.`,
        );
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await API.post(`/cloudinary/upload-multiple`, formData, {
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (!onUploadProgress || !event.total) return;
          const progress = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(progress);
        },
      });

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
