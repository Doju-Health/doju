import { useMemo, useState } from "react";
import { DataTable, DataTablePagination, DataTableWrapper } from "@/components/ui/table";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetUsers } from "../../api/use-get-users";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { getBuyersColumn } from "./buyers-table-column";

export const BuyersTable = () => {
  const {
    page: currentPage,
    size: currentSize,
    setPage,
    setSize,
  } = usePaginationQuery();
  const filters = {
    page: currentPage,
    size: currentSize,
    role: "buyer",
  };
  const getUsers = useGetUsers(filters);
  const { data: users } = getUsers || {};
  const columns = getBuyersColumn();

  const totalPages = users?.meta?.totalPages;
  const size = users?.meta?.limit;
  const totalDocuments = users?.meta?.total;

  const memoizedUsers = useMemo(() => users?.data, [users?.data]);

  return (
    <>
      <QueryWrapper currentQuery={getUsers}>
        <DataTableWrapper>
          <DataTable data={memoizedUsers ?? []} columns={columns} />
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
