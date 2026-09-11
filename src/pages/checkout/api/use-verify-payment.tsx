import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

/** The payment record as returned by GET /payments/verify. */
export type VerifyPaymentResponse = {
  id?: string;
  orderId?: string;
  buyerId?: string;
  amount?: string;
  reference?: string;
  /** Payment state, e.g. "PAID". */
  status?: string;
  /** Escrow state, e.g. "HELD". */
  escrowStatus?: string;
  provider?: string;
  channel?: string;
  paidAt?: string | null;
  message?: string;
  order?: {
    id?: string;
    orderStatus?: string;
    paymentStatus?: string;
    [key: string]: unknown;
  } | null;
  flutterwaveResponse?: {
    id?: number;
    tx_ref?: string;
    flw_ref?: string;
    /** Gateway state, e.g. "successful". */
    status?: string;
    processor_response?: string;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
};

export const useVerifyPayment = (transactionId?: string | null) => {
  const verifyPayment = async (): Promise<VerifyPaymentResponse> => {
    const queryString = buildQueryString({ transaction_id: transactionId });
    const response = await API.get(`/payments/verify?${queryString}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["verify-payment", transactionId],
    queryFn: verifyPayment,
    enabled: !!transactionId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
