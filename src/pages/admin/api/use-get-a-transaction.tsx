import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ITransactions } from "@/types";

export const useGetATransaction = (transactionId: string) => {
  const getATransaction = async (): Promise<ITransactions> => {
    const response: { data: ITransactions } = await API.get(
      `/payments/transactions/${transactionId}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: getATransaction,
    enabled: Boolean(transactionId),
  });
};
