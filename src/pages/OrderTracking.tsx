import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  useOrders,
  Order,
  OrderStatus,
  getStatusLabel,
  getStatusColor,
  getEstimatedTimeRemaining,
} from "@/hooks/useOrders";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Calendar,
  ArrowRight,
  Shield,
  Box,
  PackageCheck,
  User,
  Store,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_STEPS: {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "confirmed",
    label: "Order Confirmed",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    status: "picked_up",
    label: "Picked Up by Seller",
    icon: <Store className="h-4 w-4" />,
  },
  {
    status: "in_transit",
    label: "In Transit",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    icon: <Package className="h-4 w-4" />,
  },
  {
    status: "delivered",
    label: "Delivered",
    icon: <PackageCheck className="h-4 w-4" />,
  },
];

const OrderTracking = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { fetchOrderByNumber } = useOrders();

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Check for order data from checkout or URL params
  useEffect(() => {
    const state = location.state as { orderData?: Order } | null;
    const orderParam = searchParams.get("order");

    if (state?.orderData) {
      setOrder(state.orderData);
      setOrderId(state.orderData.order_number);
    } else if (orderParam) {
      setOrderId(orderParam);
      handleSearch(orderParam);
    }
  }, [location.state, searchParams]);

  // Subscribe to real-time updates for the current order
  useEffect(() => {
    if (!order) return;

    // Real-time updates disabled after supabase removal
    // Orders would need alternative real-time mechanism
    return () => {};
  }, [order?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = async (searchId?: string) => {
    const searchOrderId = searchId || orderId;
    if (!searchOrderId) return;

    setIsSearching(true);
    setError("");

    const foundOrder = await fetchOrderByNumber(searchOrderId.toUpperCase());

    if (foundOrder) {
      setOrder(foundOrder);
      setError("");
    } else {
      setOrder(null);
      setError("Order not found. Please check your order ID and try again.");
    }
    setIsSearching(false);
  };

  const copyDeliveryCode = () => {
    if (order) {
      navigator.clipboard.writeText(order.delivery_code);
      setCodeCopied(true);
      toast.success("Delivery code copied!");
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const getCurrentStepIndex = (status: OrderStatus): number => {
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const getStepDateTime = (status: OrderStatus): string => {
    if (!order?.status_history) return "Pending";
    const historyItem = order.status_history.find((h) => h.status === status);
    if (historyItem) {
      return new Date(historyItem.created_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return "Pending";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Show search only if no order */}
        {!order && (
          <section className="bg-gradient-to-b from-doju-navy to-doju-navy/90 py-16 md:py-24">
            <div className="container">
              <motion.div
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className="h-16 w-16 rounded-full bg-doju-lime/20 flex items-center justify-center">
                    <Package className="h-8 w-8 text-doju-lime" />
                  </div>
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Track Your Order
                </h1>
                <p className="text-primary-foreground/80 mb-8">
                  Enter your order ID to see real-time delivery updates
                </p>

                {/* Search Form */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Input
                    type="text"
                    placeholder="Enter order ID (e.g., DJ-ABC123XYZ)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="h-12 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <Button
                    variant="doju-primary"
                    size="lg"
                    className="gap-2"
                    onClick={() => handleSearch()}
                    disabled={!orderId || isSearching}
                  >
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Track
                      </>
                    )}
                  </Button>
                </motion.div>

                {error && (
                  <motion.p
                    className="text-red-300 mt-4 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Order Details */}
        {order && (
          <section className="py-8 md:py-12">
            <div className="container max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Back to search */}
                <button
                  onClick={() => {
                    setOrder(null);
                    setOrderId("");
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Search another order
                </button>

                {/* Status Header */}
                <div className="rounded-2xl border border-border bg-card p-4 md:p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Order ID
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ordered on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)}`}
                    >
                      {
                        STATUS_STEPS.find((s) => s.status === order.status)
                          ?.icon
                      }
                      <span className="font-semibold">
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  {order.status !== "delivered" && order.estimated_delivery && (
                    <div className="rounded-xl bg-doju-lime/10 border border-doju-lime/20 p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-doju-lime/20 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-doju-lime" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {getEstimatedTimeRemaining(
                              order.estimated_delivery,
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expected by {formatDate(order.estimated_delivery)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                      Delivery Status Timeline
                    </h3>
                  </div>

                  <div className="space-y-0">
                    {STATUS_STEPS.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(order.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={step.status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <motion.div
                              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? "bg-doju-lime text-doju-navy"
                                  : "bg-muted text-muted-foreground"
                              } ${isCurrent ? "ring-2 ring-doju-lime ring-offset-2 ring-offset-background" : ""}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              {step.icon}
                            </motion.div>
                            {index < STATUS_STEPS.length - 1 && (
                              <div
                                className={`w-0.5 h-12 transition-colors ${
                                  index < currentIndex
                                    ? "bg-doju-lime"
                                    : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pb-8">
                            <p
                              className={`font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {step.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getStepDateTime(step.status)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="rounded-2xl border border-border bg-card p-4 md:p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-doju-lime" />
                    Products Ordered
                  </h3>
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex gap-4 items-center py-3 border-b border-border last:border-0"
                      >
                        {item.product_image && (
                          <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          {item.seller_name && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Store className="h-3 w-3" />
                              Sold by {item.seller_name}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span>
                            {formatPrice(
                              order.total_amount -
                                order.shipping_amount -
                                order.tax_amount,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">
                            Shipping
                          </span>
                          <span>
                            {order.shipping_amount === 0
                              ? "Free"
                              : formatPrice(order.shipping_amount)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{formatPrice(order.tax_amount)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold text-doju-lime">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery Info */}
                  <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-doju-lime" />
                      Delivery Address
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">
                          {order.delivery_address}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {order.phone}
                        </span>
                      </div>
                      {order.estimated_delivery && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Estimated: {formatDate(order.estimated_delivery)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Code */}
                  <div className="rounded-2xl border-2 border-doju-lime/30 bg-doju-lime/5 p-4 md:p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-doju-lime" />
                      Your Delivery Code
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share with driver to confirm receipt
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        {order.delivery_code.split("").map((digit, i) => (
                          <motion.span
                            key={i}
                            className="w-10 h-12 flex items-center justify-center bg-card border-2 border-doju-lime rounded-lg text-xl font-bold text-foreground"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * i, type: "spring" }}
                          >
                            {digit}
                          </motion.span>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={copyDeliveryCode}
                      >
                        {codeCopied ? (
                          <CheckCircle2 className="h-5 w-5 text-doju-lime" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link to="/marketplace" className="flex-1">
                    <Button
                      variant="doju-primary"
                      size="lg"
                      className="w-full gap-2"
                    >
                      Continue Shopping
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Empty State - Encourage browsing */}
        {!order && (
          <section className="py-16 bg-muted/30">
            <div className="container text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Don't have an order yet?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse our marketplace and discover premium medical equipment
                from verified sellers.
              </p>
              <Link to="/marketplace">
                <Button variant="doju-primary" size="lg" className="gap-2">
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
