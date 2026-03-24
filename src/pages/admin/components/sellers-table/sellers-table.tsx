import { useMemo, useState } from "react";
import { DataTable, DataTableWrapper } from "@/components/ui/table";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { getSellersColumn } from "./sellers-table-column";
import { useGetUsers } from "../../api/use-get-users";
import { usePaginationQuery } from "@/hooks/use-pagination-query";

export const SellersTable = () => {
  const {
    page: currentPage,
    size: currentSize,
    setPage,
    setSize,
  } = usePaginationQuery();
  const filters = {
    page: currentPage,
    size: currentSize,
    role: "seller",
  };
  const getUsers = useGetUsers(filters);
  const { data: users } = getUsers || {};
  const columns = getSellersColumn();

  const totalPages = users?.meta?.totalPages;
  const size = users?.meta?.limit;
  const totalDocuments = users?.meta?.total;

  const memoizedUsers = useMemo(() => users?.data, [users?.data]);

  return (
    <>
      <QueryWrapper currentQuery={getUsers}>
        <DataTableWrapper>
          <DataTable data={memoizedUsers ?? []} columns={columns} />
        </DataTableWrapper>
      </QueryWrapper>
    </>
  );
};
