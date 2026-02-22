import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddProduct = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      price: number;
      description: string;
      stock: number;
      categoryId: string;
      imageUrl?: string;
    }) => {
      const response = await API.post("/products", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product Added Successfully.");
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
