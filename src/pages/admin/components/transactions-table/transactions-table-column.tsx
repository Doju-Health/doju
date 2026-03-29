import { ColumnDef } from "@tanstack/react-table";
import { ITransactions } from "@/types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "text-green-600 bg-green-100";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "FAILED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getEscrowStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case "HELD":
      return "text-blue-600 bg-blue-100";
    case "RELEASED":
      return "text-green-600 bg-green-100";
    case "REFUNDED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getTransactionsColumn = (): ColumnDef<ITransactions>[] => [
  {
    header: "PRODUCT",
    accessorKey: "order.product.name",
    cell: ({ row }) => {
      const productName = row.original.order.product.name;
      const buyerName = row.original.buyer.fullName;
      return (
        <div>
          <h2 className="font-semibold">{productName}</h2>
          <p className="text-sm text-gray-500">{buyerName}</p>
        </div>
      );
    },
  },
  {
    header: "AMOUNT",
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <div>
          <h2 className="font-semibold">
            ₦{parseFloat(amount).toLocaleString()}
          </h2>
        </div>
      );
    },
  },
  {
    header: "PAYMENT STATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <p
          className={cn(
            getStatusBadgeClass(status),
            "px-2 py-1 text-xs w-fit rounded-full capitalize",
          )}
        >
          {status}
        </p>
      );
    },
  },
  {
    header: "ESCROW STATUS",
    accessorKey: "escrowStatus",
    cell: ({ row }) => {
      const escrowStatus = row.original.escrowStatus;
      return (
        <p
          className={cn(
            getEscrowStatusBadgeClass(escrowStatus),
            "px-2 py-1 text-xs w-fit rounded-full capitalize",
          )}
        >
          {escrowStatus}
        </p>
      );
    },
  },
  {
    header: "REFERENCE",
    accessorKey: "reference",
    cell: ({ row }) => {
      const reference = row.original.reference;
      return <p className="text-sm">{reference}</p>;
    },
  },
  {
    header: "DATE",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <p className="text-sm">{formatDate(new Date(createdAt), "PPP")}</p>
      );
    },
  },
];
