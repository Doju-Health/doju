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

export const useGetMyOrders = () => {
  return useQuery<MyOrder[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await API.get("/orders/my-orders");
      return response.data.data;
    },
  });
};
