import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface MyOrderSeller {
  id: string;
  fullName: string;
  email: string;
}

export interface MyOrderCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface MyOrderProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string[];
  seller: MyOrderSeller;
  category: MyOrderCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MyOrderBuyer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface MyOrder {
  id: string;
  bulkOrderId?: string;
  buyer: MyOrderBuyer;
  product: MyOrderProduct;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress: string;
  notes: string | null;
  transactionId: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Statuses an order will not move out of on its own. */
const TERMINAL_ORDER_STATUSES = new Set([
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
]);

/** How often to re-check an order that is still in flight. */
export const MY_ORDERS_POLL_INTERVAL_MS = 30_000;

export const useGetMyOrders = () => {
  return useQuery<MyOrder[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await API.get("/orders/my-orders");
      return response.data.data;
    },
    // Tracking is only useful when it is current, so opt out of the global
    // five-minute staleTime and re-check on every mount and tab focus.
    staleTime: 0,
    refetchOnWindowFocus: true,
    // Poll only while something can still change — once every order has
    // settled there is nothing left to watch. Polling pauses automatically
    // while the tab is in the background.
    refetchInterval: (query) => {
      const orders = query.state.data;
      if (!orders?.length) return false;

      const hasOrderInFlight = orders.some(
        (order) =>
          !TERMINAL_ORDER_STATUSES.has(
            (order.orderStatus ?? "").toUpperCase(),
          ),
      );

      return hasOrderInFlight ? MY_ORDERS_POLL_INTERVAL_MS : false;
    },
  });
};
