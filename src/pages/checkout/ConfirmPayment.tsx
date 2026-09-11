import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/redux/hooks";
import { useVerifyPayment } from "./api/use-verify-payment";

/** `status` values Flutterwave puts on the redirect URL for a completed charge. */
const SUCCESSFUL_REDIRECT_STATUSES = ["completed", "successful", "success"];

/**
 * Statuses that mean the payment is settled on our side. The payment record
 * reports "PAID"; the nested gateway receipt reports "successful".
 */
const PAID_STATUSES = ["paid", "completed", "successful", "success"];

const ConfirmPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const hasSettled = useRef(false);

  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");
  const redirectStatus = searchParams.get("status");

  // Flutterwave sends us back with no transaction_id when the shopper cancels
  // or the charge never went through, so there is nothing to verify.
  const wasAbandoned =
    !transactionId ||
    (!!redirectStatus &&
      !SUCCESSFUL_REDIRECT_STATUSES.includes(redirectStatus.toLowerCase()));

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useVerifyPayment(wasAbandoned ? null : transactionId);

  const isVerified = useMemo(() => {
    if (!data) return false;

    const paymentStatus = (data.status ?? "").toString().toLowerCase();
    const gatewayStatus = (data.flutterwaveResponse?.status ?? "")
      .toString()
      .toLowerCase();

    // Treat an unlabelled 2xx as success — the endpoint only resolves for a
    // payment it could actually verify.
    if (!paymentStatus && !gatewayStatus) return true;

    return (
      PAID_STATUSES.includes(paymentStatus) ||
      PAID_STATUSES.includes(gatewayStatus)
    );
  }, [data]);

  useEffect(() => {
    if (!isVerified || hasSettled.current) return;
    hasSettled.current = true;

    clearCart();
    navigate("/track-order", { replace: true });
  }, [isVerified, clearCart, navigate]);

  const failureMessage = (() => {
    if (wasAbandoned) {
      return "Your payment was not completed. No charge was made to your account.";
    }
    if (isError) {
      const apiError = error as
        | { response?: { data?: { message?: string } }; message?: string }
        | undefined;
      return (
        apiError?.response?.data?.message ||
        apiError?.message ||
        "We could not confirm your payment. Please try again."
      );
    }
    return (
      data?.message || "We could not confirm this payment. Please try again."
    );
  })();

  const showFailure = wasAbandoned || isError || (!isPending && !isVerified);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        {!showFailure ? (
          <>
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-doju-lime" />
            <h1 className="mt-5 text-xl font-semibold text-foreground">
              Confirming your payment
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Hold on a moment while we verify your transaction. Please don't
              close this page.
            </p>
            {txRef && (
              <p className="mt-4 text-xs text-muted-foreground">
                Reference: <span className="font-mono">{txRef}</span>
              </p>
            )}
          </>
        ) : (
          <>
            <XCircle className="h-10 w-10 mx-auto text-destructive" />
            <h1 className="mt-5 text-xl font-semibold text-foreground">
              Payment not confirmed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {failureMessage}
            </p>
            {txRef && (
              <p className="mt-4 text-xs text-muted-foreground">
                Reference: <span className="font-mono">{txRef}</span>
              </p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              {!wasAbandoned && (
                <Button
                  variant="doju-primary"
                  disabled={isFetching}
                  onClick={() => refetch()}
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Retrying…
                    </>
                  ) : (
                    "Try again"
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/cart")}>
                Back to cart
              </Button>
              <Button variant="ghost" onClick={() => navigate("/track-order")}>
                View my orders
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmPayment;
