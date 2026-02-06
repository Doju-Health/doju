import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type OrderStatus =
  | "confirmed"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  seller_id: string;
  seller_name: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  updated_by: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  order_number: string;
  delivery_code: string;
  phone: string;
  delivery_address: string;
  notes: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  payment_method: string;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface CreateOrderData {
  phone: string;
  delivery_address: string;
  notes?: string;
  payment_method: string;
  items: {
    product_id?: string;
    product_name: string;
    product_image?: string;
    seller_id: string;
    seller_name?: string;
    quantity: number;
    unit_price: number;
  }[];
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
}

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DJ-${timestamp}${random}`;
};

// Generate 5-digit delivery code
const generateDeliveryCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Mock order storage
const mockOrders: Record<string, Order> = {};
const mockOrderItems: Record<string, OrderItem[]> = {};
const mockOrderHistory: Record<string, OrderStatusHistory[]> = {};

export const useOrders = () => {
  const { user, isSeller, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders based on user role
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Return mock orders
      const allOrders = Object.values(mockOrders).map((order) => ({
        ...order,
        items: mockOrderItems[order.id] || [],
        status_history: mockOrderHistory[order.id] || [],
      }));

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new order
  const createOrder = async (data: CreateOrderData): Promise<Order | null> => {
    if (!user) {
      toast.error("Please sign in to place an order");
      return null;
    }

    const orderNumber = generateOrderNumber();
    const deliveryCode = generateDeliveryCode();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    const orderId = `order-${Date.now()}`;

    try {
      const newOrder: Order = {
        id: orderId,
        buyer_id: user.id,
        order_number: orderNumber,
        delivery_code: deliveryCode,
        phone: data.phone,
        delivery_address: data.delivery_address,
        notes: data.notes || null,
        payment_method: data.payment_method,
        total_amount: data.total_amount,
        shipping_amount: data.shipping_amount,
        tax_amount: data.tax_amount,
        estimated_delivery: estimatedDelivery.toISOString(),
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in mock
      mockOrders[orderId] = newOrder;

      // Create order items
      const orderItems: OrderItem[] = data.items.map((item, i) => ({
        id: `item-${i}-${Date.now()}`,
        order_id: orderId,
        product_id: item.product_id || null,
        product_name: item.product_name,
        product_image: item.product_image || null,
        seller_id: item.seller_id,
        seller_name: item.seller_name || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        created_at: new Date().toISOString(),
      }));

      mockOrderItems[orderId] = orderItems;

      // Create status history
      const statusHistory: OrderStatusHistory = {
        id: `history-${Date.now()}`,
        order_id: orderId,
        status: "confirmed",
        notes: "Order placed successfully",
        updated_by: user.id,
        created_at: new Date().toISOString(),
      };

      mockOrderHistory[orderId] = [statusHistory];

      newOrder.items = orderItems;
      newOrder.status_history = [statusHistory];

      return newOrder;
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order", { description: error.message });
      return null;
    }
  };

  // Update order status (for sellers/admins)
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    notes?: string,
  ) => {
    if (!user) return false;

    try {
      // Update mock
      if (mockOrders[orderId]) {
        mockOrders[orderId].status = newStatus;
        mockOrders[orderId].updated_at = new Date().toISOString();

        const historyEntry: OrderStatusHistory = {
          id: `history-${Date.now()}`,
          order_id: orderId,
          status: newStatus,
          notes: notes || getStatusMessage(newStatus),
          updated_by: user.id,
          created_at: new Date().toISOString(),
        };

        if (!mockOrderHistory[orderId]) {
          mockOrderHistory[orderId] = [];
        }
        mockOrderHistory[orderId].push(historyEntry);

        toast.success("Order status updated", {
          description: `Order marked as ${getStatusLabel(newStatus)}`,
        });

        await fetchOrders();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update status", { description: error.message });
      return false;
    }
  };

  // Fetch a single order by ID or order number
  const fetchOrderByNumber = async (
    orderNumber: string,
  ): Promise<Order | null> => {
    try {
      const order = Object.values(mockOrders).find(
        (o) => o.order_number === orderNumber || o.id === orderNumber,
      );

      if (!order) return null;

      return {
        ...order,
        items: mockOrderItems[order.id] || [],
        status_history: mockOrderHistory[order.id] || [],
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchOrders();
  }, [user, fetchOrders]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    fetchOrderByNumber,
    refetch: fetchOrders,
  };
};

// Helper functions
export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    confirmed: "Order Confirmed",
    picked_up: "Picked Up by Seller",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
  };
  return labels[status];
};

export const getStatusMessage = (status: OrderStatus): string => {
  const messages: Record<OrderStatus, string> = {
    confirmed: "Order has been confirmed",
    picked_up: "Order has been picked up by seller",
    in_transit: "Order is in transit",
    out_for_delivery: "Order is out for delivery",
    delivered: "Order has been delivered",
  };
  return messages[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    picked_up: "bg-yellow-100 text-yellow-700",
    in_transit: "bg-purple-100 text-purple-700",
    out_for_delivery: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
  };
  return colors[status];
};

export const getEstimatedTimeRemaining = (
  estimatedDelivery: string | null,
): string => {
  if (!estimatedDelivery) return "Calculating...";

  const now = new Date();
  const estimated = new Date(estimatedDelivery);
  const diffMs = estimated.getTime() - now.getTime();

  if (diffMs < 0) return "Arriving soon";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Arriving in less than an hour";
  if (diffHours < 24)
    return `Arriving in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  if (diffDays === 1) return "Arriving tomorrow";
  return `Arriving in ${diffDays} days`;
};
