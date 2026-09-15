import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Exactly one identifier is sent: `bulkOrderId` for a multi-product order,
 * `orderId` for a single-product one (whose `bulkOrderId` comes back null).
 * The union makes passing both — or neither — a compile error.
 */
export type InitializePaymentPayload = { callbackUrl: string } & (
  | { bulkOrderId: string; orderId?: never }
  | { orderId: string; bulkOrderId?: never }
);

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: async (data: InitializePaymentPayload) => {
      const response = await API.post("/payments/initialize", data);
      return response.data;
    },
    onSuccess: () => {
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
