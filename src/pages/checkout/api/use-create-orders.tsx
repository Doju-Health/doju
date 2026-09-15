import { API } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/** Delivery details shared by the single-order and bulk-order endpoints. */
export interface CreateOrderDeliveryDetails {
  deliveryAddress: string;
  note?: string;
  deliveryCity?: string;
  deliveryState?: string;
  pickupStore?: string;
}

/**
 * The order record returned by POST /orders. Only the fields the checkout
 * summary and payment step actually read are declared; the API returns more.
 */
export interface SingleOrderResponse {
  id: string;
  /** Always null for a single-product order — the bulk fields are too. */
  bulkOrderId: string | null;
  quantity: number;
  /** The API mixes numeric strings and numbers across these money fields. */
  unitPrice: number | string;
  totalPrice: number | string;
  deliveryFee?: number | string | null;
  estimatedPlatformFee?: number | string | null;
  estimatedSellerAmount?: number | string | null;
  [key: string]: unknown;
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: {
      productIds: string[];
      quantities: number[];
      deliveryAddress: string;
      note?: string;
      deliveryCity?: string;
      deliveryState?: string;
      pickupStore?: string;
    }) => {
      const response = await API.post("/orders/bulk", data);
      return response.data as {
        orderId: string;
        totalPrice: number;
        bulkDeliveryFee: number;
        bulkEstimatedPlatformFee: number;
        bulkEstimatedSellerAmount: number;
        orders: any[];
      };
    },
    onSuccess: () => {
      toast.success("Order Created Successfully.");
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

/**
 * Creates a single-product order via POST /orders.
 *
 * Used when the cart holds exactly one product line; carts with more than one
 * product go through useCreateOrder (POST /orders/bulk) instead.
 */
export const useCreateSingleOrder = () => {
  return useMutation({
    mutationFn: async (
      data: CreateOrderDeliveryDetails & {
        productId: string;
        quantity: number;
      },
    ) => {
      const response = await API.post("/orders", data);
      const payload = response.data;
      // Tolerate both a bare order object and one wrapped in `data`.
      return (payload?.data ?? payload) as SingleOrderResponse;
    },
    onSuccess: () => {
      toast.success("Order Created Successfully.");
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
