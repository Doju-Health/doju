import { useMemo, useState } from "react";
import {
  DataTable,
  DataTablePagination,
  DataTableWrapper,
} from "@/components/ui/table";
import { useGetOrders } from "../../api/use-get-orders";
import { getOrdersColumns } from "./order-table-column";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { OrderDetailsModal } from "../modal/order-details-modal";
import { ISellerOrder } from "@/types";
import { usePaginationQuery } from "@/hooks/use-pagination-query";

export const OrdersTable = () => {
  const {
    setPage,
    setSize,
    page: currentPage,
    size: currentSize,
  } = usePaginationQuery();
  // This endpoint takes `limit` rather than `size`.
  const filters = { page: currentPage, limit: currentSize };
  const getOrders = useGetOrders(filters);
  const { data: orders } = getOrders || {};
  const columns = getOrdersColumns();

  const totalPages = orders?.meta?.totalPages;
  const size = orders?.meta?.limit;
  const totalDocuments = orders?.meta?.total;

  const memoizedOrders = useMemo(() => orders?.data, [orders?.data]);

  const [selectedOrder, setSelectedOrder] = useState<ISellerOrder | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <QueryWrapper currentQuery={getOrders}>
        <DataTableWrapper>
          <DataTable
            data={memoizedOrders ?? []}
            columns={columns}
            rowClick={(row) => {
              setSelectedOrder(row.original);
              setSheetOpen(true);
            }}
          />
        </DataTableWrapper>

        {(totalDocuments ?? 0) > 10 && (
          <DataTablePagination
            handleLimitChange={setSize}
            handlePageChange={setPage}
            pagination={{
              totalItems: totalDocuments ?? 0,
              totalPages: totalPages ?? 0,
              currentPage: currentPage ?? 0,
              itemsPerPage: size ?? 0,
            }}
          />
        )}
      </QueryWrapper>

      <OrderDetailsModal
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
};
