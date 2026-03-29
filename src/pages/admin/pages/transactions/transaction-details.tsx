import { format } from "date-fns";
import { ArrowLeft, BadgeCheck, ReceiptText, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetATransaction } from "../../api/use-get-a-transaction";
import { useReleaseFunds } from "../../api/use-release-funds";
import { useRefundTransaction } from "../../api/use-refund-transaction";

const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "text-green-600 bg-green-100 border-green-200";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    case "FAILED":
      return "text-red-600 bg-red-100 border-red-200";
    default:
      return "text-gray-600 bg-gray-100 border-gray-200";
  }
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "N/A";
  return format(new Date(value), "PPP p");
};

const formatNullable = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function TransactionDetailsPage() {
  const { id = "" } = useParams();
  const getTransaction = useGetATransaction(id);
  const { mutate: releaseFunds, isPending: isReleasePending } =
    useReleaseFunds();
  const { mutate: refundTransaction, isPending: isRefundPending } =
    useRefundTransaction();

  const transaction = getTransaction.data;
  const paystack =
    (transaction?.paystackResponse as Record<string, unknown> | null) ?? null;

  const canRefund =
    transaction?.order?.orderStatus?.toUpperCase() === "CANCELLED" &&
    !transaction?.order?.deliveredAt &&
    !transaction?.refundedAt;

  const canRelease =
    transaction?.status?.toUpperCase() === "PAID" &&
    !transaction?.escrowReleasedAt &&
    !transaction?.refundedAt;

  const handleReleaseFunds = () => {
    if (!transaction?.orderId) return;
    releaseFunds({ orderId: transaction.orderId });
  };

  const handleRefund = () => {
    if (!transaction?.orderId) return;
    refundTransaction({ orderId: transaction.orderId });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            to="/admin/transactions"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to transactions
          </Link>
          <h1 className="text-2xl font-bold">Transaction details</h1>
          <p className="text-muted-foreground">
            Review payment, order, and buyer details for this transaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canRelease && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isReleasePending}>
                  <Wallet className="size-4" />
                  Release funds
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Release funds now?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Confirm to release held escrow funds for this order.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isReleasePending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReleaseFunds}
                    disabled={isReleasePending}
                    
                  >
                    {isReleasePending ? "Releasing..." : "Confirm release"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canRefund && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isRefundPending}>
                  <BadgeCheck className="size-4" />
                  Refund order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Refund this transaction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This order is cancelled before delivery. Confirm to initiate
                    a refund for this transaction.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRefundPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRefund}
                    disabled={isRefundPending}
                  >
                    {isRefundPending ? "Refunding..." : "Confirm refund"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <QueryWrapper
        currentQuery={getTransaction}
        customLoader={
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-lg" />
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-56 w-full rounded-lg" />
            </div>
          </div>
        }
      >
        {!transaction ? (
          <Card>
            <CardHeader>
              <CardTitle>Transaction not found</CardTitle>
              <CardDescription>
                We could not load this transaction. Please go back and try
                another one.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ReceiptText className="size-4" />
                  Payment summary
                </CardTitle>
                <CardDescription>
                  Full transaction, order, product, seller, buyer and gateway
                  details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold">
                      ₦{parseFloat(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p
                      className={cn(
                        "px-2 py-1 text-xs w-fit rounded-full border capitalize",
                        getStatusBadgeClass(transaction.status),
                      )}
                    >
                      {transaction.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="font-semibold uppercase">
                      {formatNullable(transaction.provider)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Escrow</p>
                    <p className="font-semibold uppercase">
                      {formatNullable(transaction.escrowStatus)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.orderId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Buyer ID</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.buyerId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.reference)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Access code</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.accessCode)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Channel</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.channel)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Paid at</p>
                    <p className="font-medium">
                      {formatDateTime(transaction.paidAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Escrow held at
                    </p>
                    <p className="font-medium">
                      {formatDateTime(transaction.escrowHeldAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Escrow released at
                    </p>
                    <p className="font-medium">
                      {formatDateTime(transaction.escrowReleasedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Refunded at</p>
                    <p className="font-medium">
                      {formatDateTime(transaction.refundedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Transfer reference
                    </p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.transferReference)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Transferred at
                    </p>
                    <p className="font-medium">
                      {formatDateTime(transaction.transferredAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created at</p>
                    <p className="font-medium">
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Updated at</p>
                    <p className="font-medium">
                      {formatDateTime(
                        (transaction as { updatedAt?: string }).updatedAt,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.order?.id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.quantity)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unit price</p>
                    <p className="font-medium">
                      ₦{formatNullable(transaction.order?.unitPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total price</p>
                    <p className="font-medium">
                      ₦{formatNullable(transaction.order?.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order status
                    </p>
                    <p className="font-medium uppercase">
                      {formatNullable(transaction.order?.orderStatus)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Payment status
                    </p>
                    <p className="font-medium uppercase">
                      {formatNullable(transaction.order?.paymentStatus)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Delivery address
                    </p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.deliveryAddress)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.notes)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.product?.name)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.product?.description)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium">
                      ₦{formatNullable(transaction.order?.product?.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.product?.stock)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Is active</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.product?.isActive)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Is approved</p>
                    <p className="font-medium">
                      {formatNullable(transaction.order?.product?.isApproved)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Seller details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Full name</p>
                    <p className="font-medium">
                      {formatNullable(
                        transaction.order?.product?.seller?.fullName,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium break-all">
                      {formatNullable(
                        transaction.order?.product?.seller?.email,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone number
                    </p>
                    <p className="font-medium">
                      {formatNullable(
                        transaction.order?.product?.seller?.phoneNumber,
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buyer details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Full name</p>
                    <p className="font-medium">
                      {formatNullable(transaction.buyer?.fullName)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium break-all">
                      {formatNullable(transaction.buyer?.email)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone number
                    </p>
                    <p className="font-medium">
                      {formatNullable(transaction.buyer?.phoneNumber)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Paystack receipt</CardTitle>
                <CardDescription>
                  Important gateway fields in receipt format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Receipt number
                      </p>
                      <p className="font-semibold">
                        {formatNullable((paystack as { id?: number })?.id)}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "px-2 py-1 text-xs w-fit rounded-full border capitalize",
                        getStatusBadgeClass(
                          formatNullable(
                            (paystack as { status?: string })?.status,
                          ),
                        ),
                      )}
                    >
                      {formatNullable(
                        (paystack as { status?: string })?.status,
                      )}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Reference</p>
                      <p className="font-medium break-all">
                        {formatNullable(
                          (paystack as { reference?: string })?.reference,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Gateway response
                      </p>
                      <p className="font-medium">
                        {formatNullable(
                          (paystack as { gateway_response?: string })
                            ?.gateway_response,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Paid at</p>
                      <p className="font-medium">
                        {formatDateTime(
                          (paystack as { paid_at?: string; paidAt?: string })
                            ?.paid_at ??
                            (paystack as { paid_at?: string; paidAt?: string })
                              ?.paidAt,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Channel</p>
                      <p className="font-medium">
                        {formatNullable(
                          (paystack as { channel?: string })?.channel,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Currency</p>
                      <p className="font-medium">
                        {formatNullable(
                          (paystack as { currency?: string })?.currency,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium">
                        ₦
                        {Number(
                          (paystack as { amount?: number })?.amount ?? 0,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fees</p>
                      <p className="font-medium">
                        ₦
                        {Number(
                          (paystack as { fees?: number })?.fees ?? 0,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Customer email
                      </p>
                      <p className="font-medium break-all">
                        {formatNullable(
                          (
                            paystack as {
                              customer?: { email?: string };
                            }
                          )?.customer?.email,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Card brand
                      </p>
                      <p className="font-medium">
                        {formatNullable(
                          (
                            paystack as {
                              authorization?: { brand?: string };
                            }
                          )?.authorization?.brand,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Card last4
                      </p>
                      <p className="font-medium">
                        {formatNullable(
                          (
                            paystack as {
                              authorization?: { last4?: string };
                            }
                          )?.authorization?.last4,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bank</p>
                      <p className="font-medium">
                        {formatNullable(
                          (
                            paystack as {
                              authorization?: { bank?: string };
                            }
                          )?.authorization?.bank,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </QueryWrapper>
    </div>
  );
}
