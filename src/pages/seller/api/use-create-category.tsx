import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      imageUrl?: string;
    }) => {
      const response = await API.post("/categories", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category Added Successfully.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
