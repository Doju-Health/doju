import { OrdersTable } from "../../components/orders-table/order-table";

export default function SellerOrders() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Orders</h2>
      <OrdersTable />
    </div>
  );
}
