import {
  DataTableWrapper,
  DataTable,
  DataTablePagination,
} from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";
import { useMemo } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetAdminProducts } from "../../api/use-get-products";
import { usePaginationQuery } from "@/hooks/use-pagination-query";

export const AdminProductTable = () => {
  const {
    page: currentPage,
    size: currentSize,
    setPage,
    setSize,
  } = usePaginationQuery();
  const filters = { page: currentPage, limit: currentSize };
  const getAdminProducts = useGetAdminProducts(filters);
  const { data: adminProducts } = getAdminProducts || {};

  const memoizedAdminProducts = useMemo(
    () => adminProducts?.data,
    [adminProducts?.data],
  );
  const columns = getProductsColumns();

  const totalPages = adminProducts?.meta?.totalPages;
  const size = adminProducts?.meta?.limit;
  const totalDocuments = adminProducts?.meta?.total;

  return (
    <>
      <QueryWrapper currentQuery={getAdminProducts}>
        <DataTableWrapper className="">
          <DataTable columns={columns} data={memoizedAdminProducts ?? []} />
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
    </>
  );
};
