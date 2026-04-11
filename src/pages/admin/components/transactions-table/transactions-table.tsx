import { useMemo } from "react";
import {
  DataTable,
  DataTablePagination,
  DataTableWrapper,
} from "@/components/ui/table";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { getTransactionsColumn } from "./transactions-table-column";
import { useGetTransactions } from "../../api/use-get-transactions";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useNavigate } from "react-router-dom";

export const TransactionsTable = () => {
  const navigate = useNavigate();
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
  const getTransactions = useGetTransactions(filters);
  const { data: transactions } = getTransactions || {};
  const columns = getTransactionsColumn();

  const totalPages = transactions?.meta?.totalPages;
  const size = transactions?.meta?.limit;
  const totalDocuments = transactions?.meta?.total;

  const memoizedTransactions = useMemo(
    () => transactions?.data,
    [transactions?.data],
  );

  return (
    <>
      <QueryWrapper currentQuery={getTransactions}>
        <DataTableWrapper>
          <DataTable
            data={memoizedTransactions ?? []}
            columns={columns}
            rowClick={(row) =>
              navigate(`/admin/transactions/${row.original.id}`)
            }
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
    </>
  );
};
