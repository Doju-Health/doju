import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ConfirmDeliveryPayload {
  orderId: string;
  bulkOrderId?: string;
  feedback: string;
  rating: number;
}

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConfirmDeliveryPayload) => {
      const payload: Record<string, unknown> = {
        feedback: data.feedback,
        rating: data.rating,
      };

      // The API takes one identifier or the other, never both: a bulk order is
      // confirmed by its bulkOrderId, a standalone order by its orderId.
      const bulkOrderId = data.bulkOrderId?.trim();
      if (bulkOrderId) {
        payload.bulkOrderId = bulkOrderId;
      } else {
        payload.orderId = data.orderId;
      }

      const response = await API.post("/payments/confirm-delivery", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Delivery confirmed. Thank you for your feedback!");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
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
