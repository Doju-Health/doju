import { useGetBuyerOrders } from "../../api/use-get-buyer-orders";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import {
  DataTable,
  DataTablePagination,
  DataTableWrapper,
} from "@/components/ui/table";
import { getBuyerOrdersColumns } from "./buyer-orders-table-column";
import { useMemo } from "react";
import { usePaginationQuery } from "@/hooks/use-pagination-query";

export const AdminBuyerOrdersTable = ({ buyerId }: { buyerId: string }) => {
  const {
    setPage,
    setSize,
    page: currentPage,
    size: currentSize,
  } = usePaginationQuery();
  const filters = {
    page: currentPage,
    size: currentSize,
  };
  const getBuyerOrders = useGetBuyerOrders(buyerId, filters);
  const { data: buyerOrders } = getBuyerOrders || {};
  const columns = getBuyerOrdersColumns();

  const totalPages = buyerOrders?.meta?.totalPages;
  const size = buyerOrders?.meta?.limit;
  const totalDocuments = buyerOrders?.meta?.total;

  const memoizedBuyerOrders = useMemo(
    () => buyerOrders?.data,
    [buyerOrders?.data],
  );
  return (
    <div>
      <QueryWrapper currentQuery={getBuyerOrders}>
        <DataTableWrapper>
          <DataTable columns={columns} data={memoizedBuyerOrders ?? []} />

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
        </DataTableWrapper>
      </QueryWrapper>
    </div>
  );
};
