// Core Data Types for DOJU

export type UserRole = "buyer" | "seller" | "admin";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  documents: string[];
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  stock: number;
  sellerId: string;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  weeklyPurchases?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  createdAt: Date;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export type SignupData = {
  fullName: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
  phoneNumber: string;
};
