import {
  Package,
  BarChart3,
  ShoppingCart,
  MessageCircle,
  Settings,
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
