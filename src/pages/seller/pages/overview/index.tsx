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
import { useGetOrders } from "../../api/use-get-orders";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";

type ApiOrder = {
  id: string;
  buyer?: {
    fullName?: string;
    email?: string;
  };
  product?: {
    name?: string;
    price?: number;
    imageUrl?: string[];
  };
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  orderStatus?: string;
  paymentStatus?: string;
  createdAt?: string;
};

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

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "confirmed":
    case "success":
    case "completed":
    case "paid":
      return "bg-green-100 text-green-700";
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "rejected":
    case "failed":
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-700";
    case "in_transit":
    case "shipped":
    case "out_for_delivery":
      return "bg-blue-100 text-blue-700";
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
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
      return (
        <Badge className={`${getStatusColor(status)} gap-1`}>
          {status || "unknown"}
        </Badge>
      );
  }
};
export default function SellerDashboard() {
  const getOrders = useGetOrders();
  const { data: orders = [], isLoading, isError } = getOrders || {};
  const recentOrders: ApiOrder[] = Array.isArray(orders)
    ? (orders as ApiOrder[]).slice(0, 5)
    : [];

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number" || Number.isNaN(amount)) return "--";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(amount);
  };
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
          <QueryWrapper currentQuery={getOrders}>
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}

            {recentOrders.map((order) => {
              const productName = order.product?.name || "Order";
              const quantity = order.quantity ?? 0;
              const total = order.totalPrice ?? order.unitPrice ?? 0;

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {quantity} item{quantity === 1 ? "" : "s"} •{" "}
                      {formatCurrency(total)}
                    </p>
                    {order.buyer?.fullName && (
                      <p className="text-xs text-muted-foreground">
                        Buyer: {order.buyer.fullName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {order.orderStatus && getStatusBadge(order.orderStatus)}
                    {order.paymentStatus && (
                      <Badge
                        className={`${getStatusColor(order.paymentStatus)} gap-1`}
                        variant="outline"
                      >
                        {order.paymentStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </QueryWrapper>
        </div>
      </motion.div>
    </div>
  );
}
