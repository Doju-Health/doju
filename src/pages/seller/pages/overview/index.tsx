import { OverviewCard } from "../../components/overview-card";
import {
  ArrowUpRight,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetDashboardOverview } from "../../api/use-get-dashboard-overview";
import { useGetDashboardRevenueCharts } from "../../api/use-get-dashboard-revenue-charts";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type RecentOrder = {
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

type TopProduct = {
  id: string;
  name?: string;
  imageUrl?: string;
  totalSold?: number;
  revenue?: number;
};

type DashboardOverview = {
  revenue: {
    total: number;
    pending: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    completed: number;
    cancelled: number;
    pendingDelivery: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    lowStock: number;
  };
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  performance: {
    averageDeliveryTime: number;
    orderFulfillmentRate: number;
    customerSatisfaction: number;
    totalCustomers: number;
  };
};

const MONTH_OPTIONS = [
  { label: "Last 3 months", value: 3 },
  { label: "Last 6 months", value: 6 },
  { label: "Last 9 months", value: 9 },
  { label: "Last 12 months", value: 12 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig;

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
  const dashboardQuery = useGetDashboardOverview();
  const overview: DashboardOverview | undefined = dashboardQuery?.data;
  const [months, setMonths] = useState(6);
  const revenueChartQuery = useGetDashboardRevenueCharts(months);
  const revenueChartData: { month: string; revenue: number }[] = Array.isArray(
    revenueChartQuery?.data,
  )
    ? revenueChartQuery.data
    : [];

  const selectedMonthLabel =
    MONTH_OPTIONS.find((o) => o.value === months)?.label ?? `${months} months`;
  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number" || Number.isNaN(amount)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const stats = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatCurrency(overview?.revenue?.total),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Package,
      label: "Total Products",
      value: String(overview?.products?.total ?? 0),
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: String(overview?.orders?.total ?? 0),
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Clock,
      label: "Pending Delivery",
      value: String(overview?.orders?.pendingDelivery ?? 0),
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const recentOrders: RecentOrder[] = Array.isArray(overview?.recentOrders)
    ? overview.recentOrders
    : [];

  const topProducts: TopProduct[] = Array.isArray(overview?.topProducts)
    ? overview.topProducts
    : [];

  return (
    <QueryWrapper currentQuery={dashboardQuery}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Seller Overview</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <OverviewCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-4 lg:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Revenue Overview</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {selectedMonthLabel}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {MONTH_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setMonths(option.value)}
                    className={months === option.value ? "font-semibold" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {revenueChartQuery.isLoading ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
              Loading chart…
            </div>
          ) : revenueChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
              No revenue data available.
            </div>
          ) : (
            <ChartContainer
              config={revenueChartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart
                data={revenueChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-NG", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(Number(value))
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </motion.div>

        {/* Revenue & Performance Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Revenue Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-4 lg:p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Revenue</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="font-medium">
                  {formatCurrency(overview?.revenue?.thisMonth)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Last Month
                </span>
                <span className="font-medium">
                  {formatCurrency(overview?.revenue?.lastMonth)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium">
                  {formatCurrency(overview?.revenue?.pending)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> Growth
                </span>
                <span
                  className={`font-semibold ${(overview?.revenue?.growth ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {overview?.revenue?.growth ?? 0}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-border bg-card p-4 lg:p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Truck className="h-4 w-4" /> Avg. Delivery Time
                </span>
                <span className="font-medium">
                  {overview?.performance?.averageDeliveryTime ?? 0} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Fulfillment Rate
                </span>
                <span className="font-medium">
                  {overview?.performance?.orderFulfillmentRate ?? 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-4 w-4" /> Customer Satisfaction
                </span>
                <span className="font-medium">
                  {overview?.performance?.customerSatisfaction ?? 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" /> Total Customers
                </span>
                <span className="font-medium">
                  {overview?.performance?.totalCustomers ?? 0}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Orders Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-4 lg:p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">
            Order Status Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Pending",
                value: overview?.orders?.pending ?? 0,
                color: "text-yellow-600",
              },
              {
                label: "Confirmed",
                value: overview?.orders?.confirmed ?? 0,
                color: "text-blue-600",
              },
              {
                label: "Shipped",
                value: overview?.orders?.shipped ?? 0,
                color: "text-indigo-600",
              },
              {
                label: "Delivered",
                value: overview?.orders?.delivered ?? 0,
                color: "text-emerald-600",
              },
              {
                label: "Completed",
                value: overview?.orders?.completed ?? 0,
                color: "text-green-600",
              },
              {
                label: "Cancelled",
                value: overview?.orders?.cancelled ?? 0,
                color: "text-red-600",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-muted/50 p-3 text-center"
              >
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Products Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-border bg-card p-4 lg:p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Product Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Active",
                value: overview?.products?.active ?? 0,
                color: "text-green-600",
              },
              {
                label: "Inactive",
                value: overview?.products?.inactive ?? 0,
                color: "text-slate-600",
              },
              {
                label: "Out of Stock",
                value: overview?.products?.outOfStock ?? 0,
                color: "text-red-600",
              },
              {
                label: "Low Stock",
                value: overview?.products?.lowStock ?? 0,
                color: "text-yellow-600",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-muted/50 p-3 text-center"
              >
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
          </div>
        </motion.div>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-2xl border border-border bg-card p-4 lg:p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Top Products</h3>
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {product.name || "Product"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.totalSold ?? 0} sold
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </QueryWrapper>
  );
}
