import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  MapPin,
  Phone,
  Package as PackageIcon,
} from "lucide-react";

const STATIC_ORDERS = [
  {
    id: "1",
    orderNumber: "ORD-001",
    status: "confirmed",
    statusLabel: "Confirmed",
    totalAmount: "₦45,000",
    deliveryAddress: "123 Main Street, Lagos, Nigeria",
    phoneNumber: "+2348012345678",
    items: [
      {
        id: "item-1",
        productName: "Digital Blood Pressure Monitor",
        productImage:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
        quantity: 2,
        unitPrice: 12500,
      },
      {
        id: "item-2",
        productName: "Wireless Thermometer",
        productImage:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=100&h=100&fit=crop",
        quantity: 1,
        unitPrice: 8750,
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    status: "in_transit",
    statusLabel: "In Transit",
    totalAmount: "₦25,000",
    deliveryAddress: "456 Oak Avenue, Abuja, Nigeria",
    phoneNumber: "+2348098765432",
    items: [
      {
        id: "item-3",
        productName: "Pulse Oximeter",
        productImage:
          "https://images.unsplash.com/photo-1631217314830-c63e6f1863f7?w=100&h=100&fit=crop",
        quantity: 3,
        unitPrice: 9200,
      },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    status: "delivered",
    statusLabel: "Delivered",
    totalAmount: "₦37,500",
    deliveryAddress: "789 Pine Road, Port Harcourt, Nigeria",
    phoneNumber: "+2347055555555",
    items: [
      {
        id: "item-4",
        productName: "Digital Blood Pressure Monitor",
        productImage:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop",
        quantity: 1,
        unitPrice: 12500,
      },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "in_transit":
      return "bg-yellow-100 text-yellow-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString("en-NG")}`;
};

interface OrdersTabProps {
  onUpdateStatus?: (orderId: string, status: string) => void;
}

export const OrdersTab = ({ onUpdateStatus }: OrdersTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Your Orders ({STATIC_ORDERS.length})
        </h2>
      </div>

      {STATIC_ORDERS.length > 0 ? (
        <div className="space-y-4">
          {STATIC_ORDERS.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-foreground">
                      {order.totalAmount}
                    </p>
                    <Badge className={`${getStatusColor(order.status)} mt-1`}>
                      {order.statusLabel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground flex-shrink-0">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Delivery Information
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {order.deliveryAddress}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {order.phoneNumber}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {order.status !== "delivered" && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="doju-primary"
                        size="sm"
                        onClick={() => onUpdateStatus?.(order.id, order.status)}
                      >
                        Update Status
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground rounded-2xl border border-border bg-card p-8">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-sm">
            When customers order your products, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
};
