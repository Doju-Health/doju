import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ISellerOrder } from "@/types";
import { cn, formatPriceAmount } from "@/lib/utils";
import { getStatusBadge } from "../orders-table/order-table-column";
import { useMarkAsShipped } from "../../api/use-mark-as-shipped";
import { useMarkAsDelivered } from "../../api/use-mark-as-delivered";
import { CheckCircle, Truck } from "lucide-react";
import { format } from "date-fns";

interface OrderDetailsModalProps {
  order: ISellerOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsModal = ({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) => {
  const { mutate: markAsShipped, isPending: isMarkingAsShipped } =
    useMarkAsShipped();
  const { mutate: markAsDelivered, isPending: isMarkingAsDelivered } =
    useMarkAsDelivered();

  const normalizedPaymentStatus = order?.paymentStatus?.toLowerCase();
  const normalizedOrderStatus = order?.orderStatus?.toLowerCase();

  const canMarkAsShipped =
    normalizedPaymentStatus === "paid" && normalizedOrderStatus === "confirmed";
  const canMarkAsDelivered = normalizedOrderStatus === "shipped";

  const handleMarkAsShipped = () => {
    if (!order) return;
    markAsShipped(order.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleMarkAsDelivered = () => {
    if (!order) return;
    markAsDelivered(order.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        {order && (
          <>
            <SheetHeader>
              <SheetTitle>Order Details</SheetTitle>
              <SheetDescription>
                Order #{order.id.slice(0, 8).toUpperCase()}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Product Info */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Product
                </h4>
                <div className="flex gap-4">
                  {order.product.imageUrl?.[0] && (
                    <img
                      src={order.product.imageUrl[0]}
                      alt={order.product.name}
                      className="h-20 w-20 rounded-lg object-cover border"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {order.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unit Price: {formatPriceAmount(order.unitPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {order.quantity}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Buyer Info */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Buyer
                </h4>
                <div className="space-y-1">
                  <p className="font-medium">{order.buyer.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.buyer.email}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Price
                    </span>
                    <span className="font-semibold">
                      {formatPriceAmount(order.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Order Status
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Payment Status
                    </span>
                    <Badge
                      className={cn(
                        "text-xs rounded-full",
                        order.paymentStatus.toLowerCase() === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700",
                      )}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery & Notes */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Delivery & Notes
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Delivery Address
                    </span>
                    <p className="text-sm font-medium mt-0.5">
                      {order.deliveryAddress || "—"}
                    </p>
                  </div>
                  {order.notes && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Notes
                      </span>
                      <p className="text-sm font-medium mt-0.5">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Meta Info */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Additional Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Transaction ID
                    </span>
                    <span className="font-mono text-xs">
                      {order.transactionId || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>
                      {format(
                        new Date(order.createdAt),
                        "MMM dd, yyyy · h:mm a",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>
                      {format(
                        new Date(order.updatedAt),
                        "MMM dd, yyyy · h:mm a",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(canMarkAsShipped || canMarkAsDelivered) && (
              <>
                <Separator />
                <SheetFooter className="pt-2">
                  {canMarkAsShipped && (
                    <Button
                      className="w-full gap-2"
                      onClick={handleMarkAsShipped}
                      disabled={isMarkingAsShipped}
                      isLoading={isMarkingAsShipped}
                    >
                      <Truck className="h-4 w-4" />
                      Mark as Shipped
                    </Button>
                  )}

                  {canMarkAsDelivered && (
                    <Button
                      className="w-full gap-2"
                      onClick={handleMarkAsDelivered}
                      disabled={isMarkingAsDelivered}
                      isLoading={isMarkingAsDelivered}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Delivered
                    </Button>
                  )}
                </SheetFooter>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
