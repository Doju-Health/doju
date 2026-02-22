import { OverviewCard } from "../../components/overview-card";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATIC_STATS = [
  {
    icon: DollarSign,
    label: "Total Revenue",
    value: "₦245,000",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Package,
    label: "Total Products",
    value: "28",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: ShoppingCart,
    label: "Total Orders",
    value: "156",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    label: "Pending Delivery",
    value: "12",
    color: "bg-yellow-100 text-yellow-600",
  },
];

const RECENT_ORDERS = [
  {
    id: "ORD-001",
    number: "Order #ORD-001",
    items: 3,
    status: "confirmed",
    statusLabel: "Confirmed",
  },
  {
    id: "ORD-002",
    number: "Order #ORD-002",
    items: 1,
    status: "in_transit",
    statusLabel: "In Transit",
  },
  {
    id: "ORD-003",
    number: "Order #ORD-003",
    items: 2,
    status: "delivered",
    statusLabel: "Delivered",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className={`${getStatusColor("approved")} gap-1`}>
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge className={`${getStatusColor("pending")} gap-1`}>
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};
export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Seller Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATIC_STATS.map((stat, index) => (
          <OverviewCard key={index} stat={stat} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border bg-card p-4 lg:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <Button variant="ghost" size="sm">
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{order.number}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items} item(s)
                </p>
              </div>
              <Badge className={`${getStatusColor(order.status)}`}>
                {order.statusLabel}
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
