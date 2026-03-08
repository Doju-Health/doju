import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      price: number;
      description: string;
      stock: number;
      categoryId: string;
      imageUrl?: string[];
    }) => {
      const response = await API.patch(`/products/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellersProducts"] });
      toast.success("Product updated successfully.");
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
