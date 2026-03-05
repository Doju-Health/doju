import { useState } from "react";
import { DataTable, DataTableWrapper } from "@/components/ui/table";
import { useGetOrders } from "../../api/use-get-orders";
import { getOrdersColumns } from "./order-table-column";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { OrderDetailsModal } from "../modal/order-details-modal";
import { ISellerOrder } from "@/types";

export const OrdersTable = () => {
  const getOrders = useGetOrders();
  const { data: orders } = getOrders || {};
  const columns = getOrdersColumns();

  const [selectedOrder, setSelectedOrder] = useState<ISellerOrder | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <QueryWrapper currentQuery={getOrders}>
        <DataTableWrapper>
          <DataTable
            data={orders ?? []}
            columns={columns}
            rowClick={(row) => {
              setSelectedOrder(row.original);
              setSheetOpen(true);
            }}
          />
        </DataTableWrapper>
      </QueryWrapper>

      <OrderDetailsModal
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
};
