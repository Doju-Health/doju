import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FilterProps, PaginatedTransactionsData } from "@/types";

export const useGetTransactions = (filters?: FilterProps) => {
  const getTransactions = async () => {
    const queryString = buildQueryString({ ...filters });
    const response: { data: PaginatedTransactionsData } = await API.get(
      `/payments/transactions${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: getTransactions,
  });
};
