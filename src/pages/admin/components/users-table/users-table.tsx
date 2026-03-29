import { useMemo, useState } from "react";
import {
  DataTable,
  DataTablePagination,
  DataTableWrapper,
} from "@/components/ui/table";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { getUsersColumn } from "./users-table-column";
import { useGetUsers } from "../../api/use-get-users";
import { usePaginationQuery } from "@/hooks/use-pagination-query";

export const UsersTable = () => {
  const {
    setPage,
    setSize,
    page: currentPage,
    size: currentSize,
  } = usePaginationQuery();
  const filters = {
    page: currentPage,
    size: currentSize,
  }
  const getUsers = useGetUsers(filters);
  const { data: users } = getUsers || {};
  const columns = getUsersColumn();

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
    </>
  );
};
