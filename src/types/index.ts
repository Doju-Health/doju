// Core Data Types for DOJU

import { LucideIcon } from "lucide-react";

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
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
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

export interface NavItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  isActive?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export type IProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  imageUrl: string[];
  seller: {
    id: string;
    fullName: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isApproved?: boolean; // Optional field to indicate approval status
};

// API response types
export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string[];
  seller: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    companyName?: string | null;
    address?: string | null;
    licenseNumber?: string | null;
    isActive?: boolean;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  category: ApiCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ISellerOrder {
  id: string;
  buyer: {
    id: string;
    fullName: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string[];
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  deliveryAddress: string;
  notes: string | null;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategories {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryDetail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface IUsers {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  companyName: string | null;
  address: string | null;
  profileImageUrl: string | null;
  licenseNumber: string | null;
  paystackRecipientCode: string | null;
  emailVerified: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ninUrl: string | null;
  cacUrl: string | null;
}

export type FilterProps = {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  search?: string;
  type?: string | null;
  status?: string;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedUsersData = {
  data: IUsers[];
  meta: Meta;
};

export type IBuyerOrders = {
  id: string;
  buyer: {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    googleId: string | null;
    emailVerified: boolean;
    verificationOtp: string;
    verificationOtpExpires: string;
    passwordResetOtp: string | null;
    passwordResetOtpExpires: string | null;
    companyName: string | null;
    address: string | null;
    profileImageUrl: string | null;
    licenseNumber: string | null;
    paystackRecipientCode: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    imageUrl: string[];
    seller: {
      id: string;
      fullName: string;
      email: string;
      password: string;
      phoneNumber: string;
      role: "seller";
      googleId: string | null;
      emailVerified: boolean;
      verificationOtp: string;
      verificationOtpExpires: string;
      passwordResetOtp: string | null;
      passwordResetOtpExpires: string | null;
      companyName: string | null;
      address: string | null;
      profileImageUrl: string | null;
      licenseNumber: string | null;
      paystackRecipientCode: string | null;
      isVerified: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    isActive: boolean;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  bulkOrderId: string | null;
  orderStatus: "COMPLETED" | "PENDING" | "CANCELLED";
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  deliveryAddress: string;
  notes: string | null;
  transactionId: string;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedBuyerOrdersData = {
  data: IBuyerOrders[];
  meta: Meta;
};

export type ITransactions = {
  id: string;
  order: {
    id: string;
    product: {
      id: string;
      name: string;
      description: string;
      price: string;
      stock: number;
      imageUrl: string[];
      seller: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
        profileImageUrl: string | null;
        licenseNumber: string | null;
        paystackRecipientCode: string | null;
        isVerified: boolean;
        isActive: boolean;
        createdAt: string;
      };
      isActive: true;
      isApproved: false;
      createdAt: string;
    };
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    bulkOrderId: string | null;
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
  };
  orderId: string;
  buyer: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    profileImageUrl: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  };
  buyerId: string;
  amount: string;
  reference: string;
  accessCode: string;
  status: string;
  escrowStatus: string;
  provider: string;
  channel: string | null;
  paystackResponse: Record<string, any> | null;
  paidAt: string | null;
  escrowHeldAt: string | null;
  escrowReleasedAt: string | null;
  refundedAt: string | null;
  transferReference: string | null;
  transferredAt: string | null;
  createdAt: string;
};

export type PaginatedTransactionsData = {
  data: ITransactions[];
  meta: Meta;
};
