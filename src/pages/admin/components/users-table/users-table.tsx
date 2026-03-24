import { useMemo, useState } from "react";
import { DataTable, DataTableWrapper } from "@/components/ui/table";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { getUsersColumn } from "./users-table-column";
import { useGetUsers } from "../../api/use-get-users";

export const UsersTable = () => {
  const getUsers = useGetUsers();
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
      </QueryWrapper>
    </>
  );
};
