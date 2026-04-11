import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  useGetMyOrders,
  MyOrder,
} from "@/pages/order-tracking/api/use-get-my-orders";
import { useDeleteOrder } from "@/pages/order-tracking/api/use-delete-order";
import { useCompleteOrder } from "@/pages/order-tracking/api/use-complete-order";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Store,
  PackageCheck,
  Copy,
  CheckCircle2,
  ShoppingBag,
  Loader2,
  AlertCircle,
  CreditCard,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/redux/hooks";

type OrderStatusKey =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

const STATUS_STEPS: {
  status: OrderStatusKey;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "PENDING",
    label: "Order Placed",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    status: "CONFIRMED",
    label: "Order Confirmed",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    icon: <Store className="h-4 w-4" />,
  },
  {
    status: "IN_TRANSIT",
    label: "In Transit",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    status: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: <Package className="h-4 w-4" />,
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    icon: <PackageCheck className="h-4 w-4" />,
  },
];

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "SHIPPED":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "DELIVERED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "FAILED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const OrderTracking = () => {
  const { data: orders, isLoading, isError, refetch } = useGetMyOrders();
  const deleteOrderMutation = useDeleteOrder();
  const completeOrderMutation = useCompleteOrder();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<MyOrder | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Clear cart when redirected back from Paystack after payment
  useEffect(() => {
    if (searchParams.get("reference") || searchParams.get("trxref")) {
      clearCart();
    }
  }, []);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      setSelectedOrder(null);
      refetch();
    } catch {
      // Error handled by mutation's onError
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await completeOrderMutation.mutateAsync(orderId);
      setSelectedOrder(null);
      refetch();
    } catch {
      // Error handled by mutation's onError
    }
  };

  const copyTransactionId = (transactionId: string) => {
    navigator.clipboard.writeText(transactionId);
    setCodeCopied(true);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const getCurrentStepIndex = (status: string): number => {
    return STATUS_STEPS.findIndex((s) => s.status === status.toUpperCase());
  };

  // Order detail view
  if (selectedOrder) {
    const stepIndex = getCurrentStepIndex(selectedOrder.orderStatus);

    return (
      <div className="min-h-screen flex flex-col bg-background w-full">
        <Header />
        <main className="flex-1">
          <section className="py-8 md:py-12">
            <div className="container max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Back button */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to all orders
                </button>

                {/* Status Header */}
                <div className="rounded-2xl border border-border bg-card p-4 md:p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Transaction ID
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {selectedOrder.transactionId || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ordered on {formatDateTime(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.orderStatus)}`}
                      >
                        {STATUS_STEPS.find(
                          (s) =>
                            s.status ===
                            selectedOrder.orderStatus.toUpperCase(),
                        )?.icon || <Clock className="h-4 w-4" />}
                        <span>{selectedOrder.orderStatus}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                      >
                        <CreditCard className="h-3 w-3" />
                        <span>Payment: {selectedOrder.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {selectedOrder.orderStatus.toUpperCase() !== "CANCELLED" && (
                    <>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                          Order Status Timeline
                        </h3>
                      </div>
                      <div className="space-y-0">
                        {STATUS_STEPS.map((step, index) => {
                          const isCompleted = index <= stepIndex;
                          const isCurrent = index === stepIndex;

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
                                      index < stepIndex
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
                                  {isCompleted
                                    ? isCurrent
                                      ? formatDateTime(selectedOrder.updatedAt)
                                      : "Completed"
                                    : "Pending"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Product Info */}
                <div className="rounded-2xl border border-border bg-card p-4 md:p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-doju-lime" />
                    Product Ordered
                  </h3>
                  <div className="flex gap-4 items-center py-3">
                    {selectedOrder.product.imageUrl?.[0] && (
                      <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={selectedOrder.product.imageUrl[0]}
                          alt={selectedOrder.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-lg">
                        {selectedOrder.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {selectedOrder.product.description}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Qty: {selectedOrder.quantity}
                      </p>
                      {selectedOrder.product.seller && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Store className="h-3 w-3" />
                          Sold by {selectedOrder.product.seller.fullName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(selectedOrder.unitPrice)} ×{" "}
                        {selectedOrder.quantity}
                      </p>
                      <p className="text-lg font-bold text-doju-lime">
                        {formatPrice(selectedOrder.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery Info */}
                  <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-doju-lime" />
                      Delivery Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">
                          {selectedOrder.deliveryAddress}
                        </span>
                      </div>
                      {selectedOrder.notes && (
                        <div className="flex items-start gap-2">
                          <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground italic">
                            "{selectedOrder.notes}"
                          </span>
                        </div>
                      )}
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Tracking: {selectedOrder.trackingNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transaction Info */}
                  {selectedOrder.transactionId && (
                    <div className="rounded-2xl border-2 border-doju-lime/30 bg-doju-lime/5 p-4 md:p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-doju-lime" />
                        Transaction Info
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your transaction reference
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground break-all">
                          {selectedOrder.transactionId}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() =>
                            copyTransactionId(selectedOrder.transactionId!)
                          }
                        >
                          {codeCopied ? (
                            <CheckCircle2 className="h-4 w-4 text-doju-lime" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
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

                  {selectedOrder.orderStatus.toUpperCase() === "DELIVERED" && (
                    <Button
                      variant="doju-primary"
                      size="lg"
                      className="gap-2"
                      onClick={() => handleCompleteOrder(selectedOrder.id)}
                      disabled={completeOrderMutation.isPending}
                    >
                      {completeOrderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Mark as Complete
                    </Button>
                  )}

                  {["PENDING", "CONFIRMED"].includes(
                    selectedOrder.orderStatus.toUpperCase(),
                  ) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="lg"
                          className="gap-2"
                          disabled={deleteOrderMutation.isPending}
                        >
                          {deleteOrderMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this order?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your order
                            {selectedOrder.transactionId
                              ? ` (${selectedOrder.transactionId})`
                              : ""}{" "}
                            and remove it from your order history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteOrderMutation.isPending
                              ? "Deleting..."
                              : "Yes, delete order"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Orders list view
  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-doju-navy to-doju-navy/90 py-12 md:py-16">
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
                My Orders
              </h1>
              <p className="text-primary-foreground/80">
                Track and manage all your orders in one place
              </p>
            </motion.div>
          </div>
        </section>

        {/* Orders List */}
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-doju-lime mb-4" />
                <p className="text-muted-foreground">Loading your orders...</p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-foreground font-semibold mb-2">
                  Failed to load orders
                </p>
                <p className="text-muted-foreground mb-4">
                  Something went wrong. Please try again.
                </p>
                <Button variant="doju-primary" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && (!orders || orders.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  No orders yet
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md text-center">
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
            )}

            {/* Orders */}
            {!isLoading && orders && orders.length > 0 && (
              <AnimatePresence>
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl border border-border bg-card p-4 md:p-6 hover:border-doju-lime/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        {order.product.imageUrl?.[0] && (
                          <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                            <img
                              src={order.product.imageUrl[0]}
                              alt={order.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground line-clamp-1">
                                {order.product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Qty: {order.quantity} ·{" "}
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-foreground whitespace-nowrap">
                              {formatPrice(order.totalPrice)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                            >
                              {STATUS_STEPS.find(
                                (s) =>
                                  s.status === order.orderStatus.toUpperCase(),
                              )?.icon || <Clock className="h-3 w-3" />}
                              {order.orderStatus}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                            >
                              <CreditCard className="h-3 w-3" />
                              {order.paymentStatus}
                            </span>
                            {order.product.seller && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Store className="h-3 w-3" />
                                {order.product.seller.fullName}
                              </span>
                            )}
                          </div>

                          {order.transactionId && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Txn: {order.transactionId}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="hidden sm:flex items-center">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
