import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  ShoppingCart,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";

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

const RECENT_PRODUCTS = [
  {
    id: 1,
    name: "Digital Blood Pressure Monitor",
    price: "₦12,500",
    stock: 45,
    status: "approved",
    category: "Medical Devices",
  },
  {
    id: 2,
    name: "Wireless Thermometer",
    price: "₦8,750",
    stock: 32,
    status: "pending",
    category: "Medical Devices",
  },
  {
    id: 3,
    name: "Pulse Oximeter",
    price: "₦9,200",
    stock: 28,
    status: "approved",
    category: "Medical Devices",
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

interface OverviewTabProps {
  onViewAllOrders?: () => void;
  onViewAllProducts?: () => void;
  onAddProduct?: () => void;
}

export const OverviewTab = ({
  onViewAllOrders,
  onViewAllProducts,
  onAddProduct,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATIC_STATS.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-border bg-card p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border bg-card p-4 lg:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <Button variant="ghost" size="sm" onClick={onViewAllOrders}>
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

      {/* Recent Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-border bg-card p-4 lg:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            Recent Products ({RECENT_PRODUCTS.length})
          </h3>
          <Button variant="ghost" size="sm" onClick={onViewAllProducts}>
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {RECENT_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock} • {product.category}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="font-semibold text-doju-lime">{product.price}</p>
                {getStatusBadge(product.status)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
