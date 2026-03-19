import {
  Package,
  BarChart3,
  ShoppingCart,
  MessageCircle,
  Settings,
  LayoutGrid,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import type { NavGroup } from "@/types";

export const sidebarNav: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Overview",
        icon: BarChart3,
        href: "/seller/overview",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Products",
        icon: Package,
        href: "/seller/products",
      },
      {
        title: "Orders",
        icon: ShoppingCart,
        href: "/seller/orders",
      },
      {
        title: "Categories",
        icon: LayoutGrid,
        href: "/seller/categories",
      },
      {
        title: "KYC Verification",
        icon: Shield,
        href: "/seller/kyc-verification",
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/seller/settings",
      },
    ],
  },
];

export const adminSidebarNav: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/seller/dashboard",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Products",
        icon: Package,
        href: "/seller/products",
      },
      {
        title: "Orders",
        icon: ShoppingCart,
        href: "/seller/orders",
      },
      {
        title: "Categories",
        icon: LayoutGrid,
        href: "/seller/categories",
      },
      {
        title: "Messages",
        icon: MessageCircle,
        href: "/seller/messages",
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Settings",
        icon: Settings,
        href: "/seller/settings",
      },
    ],
  },
];
