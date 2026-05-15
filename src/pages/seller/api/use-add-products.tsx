import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      price: number;
      description: string;
      stock: number;
      categoryId: string;
      imageUrl?: string[];
      size: string;
    }) => {
      const response = await API.post("/products", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product Added Successfully.");
      queryClient.invalidateQueries({ queryKey: ["sellersProducts"] });
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
