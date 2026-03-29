import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ITransactions, PaginatedTransactionsData } from "@/types";

export const useGetATransaction = (transactionId: string) => {
  const getATransaction = async () => {
    const pageSize = 50;
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const response: { data: PaginatedTransactionsData } = await API.get(
        `/payments/transactions?page=${currentPage}&size=${pageSize}`,
      );

      const payload = response.data;
      const transactions = payload?.data ?? [];

      const matchedTransaction = transactions.find(
        (transaction) =>
          transaction.id === transactionId ||
          transaction.orderId === transactionId ||
          transaction.order?.id === transactionId,
      );

      if (matchedTransaction) {
        return matchedTransaction;
      }

      totalPages = payload?.meta?.totalPages ?? 1;
      currentPage += 1;
    }

    throw new Error("Transaction not found");
  };

  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: getATransaction,
    enabled: Boolean(transactionId),
  });
};
