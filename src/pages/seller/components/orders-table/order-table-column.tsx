import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Clock,
  EllipsisVertical,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { ISellerOrder } from "@/types";
import { cn, formatPriceAmount } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const getStatusBadge = (status: string) => {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "DELIVERED":
      return (
        <Badge className="bg-green-100 text-green-700 gap-1 uppercase">
          <CheckCircle className="h-3 w-3" />
          Delivered
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 gap-1 uppercase">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge className="bg-blue-100 text-blue-700 gap-1 uppercase ">
          <PackageCheck className="h-3 w-3" />
          Confirmed
        </Badge>
      );
    case "SHIPPED":
    case "IN_TRANSIT":
      return (
        <Badge className="bg-purple-100 text-purple-700 gap-1 uppercase">
          <Truck className="h-3 w-3" />
          {normalized === "SHIPPED" ? "Shipped" : "In Transit"}
        </Badge>
      );
    case "OUT_FOR_DELIVERY":
      return (
        <Badge className="bg-indigo-100 text-indigo-700 gap-1 uppercase">
          <Truck className="h-3 w-3" />
          Out for Delivery
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-red-100 text-red-700 gap-1 uppercase">
          <XCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-700 gap-1">{status}</Badge>
      );
  }
};

const ActionCell = ({ productId }: { productId: string }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:text-white! cursor-pointer"
          onClick={() => navigate(`/seller/products/${productId}`)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-cente">Edit</DropdownMenuItem>
        <DropdownMenuItem className="justify-cente">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getOrdersColumns = (): // onViewDetails,
ColumnDef<ISellerOrder>[] => [
  {
    header: "BUYER",
    accessorKey: "buyer",
    cell: ({ row }) => {
      const buyer = row.original.buyer.fullName;
      const buyerEmail = row.original.buyer.email;
      return (
        <div>
          <h2 className="font-semibold">{buyer}</h2>
          <p>{buyerEmail}</p>
        </div>
      );
    },
  },

  {
    header: "PRODUCT",
    accessorKey: "product",
    cell: ({ row }) => {
      const product = row.original.product.name;
      const productPrice = row.original.product.price;
      return (
        <div>
          <h3>{product}</h3>
          <p>{formatPriceAmount(productPrice)}</p>
        </div>
      );
    },
  },

  {
    header: "QUANTITY",
    accessorKey: "quantity",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return <p className="">{quantity}</p>;
    },
  },
  {
    header: "TOTAL PRICE",
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      const totalPrice = row.original.totalPrice;
      return <p className="">{formatPriceAmount(totalPrice)}</p>;
    },
  },
  {
    header: "ORDER STATUS",
    accessorKey: "orderStatus",
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      return getStatusBadge(status);
    },
  },
  {
    header: "PAYMENT STATUS",
    accessorKey: "paymentStatus",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      return (
        <Badge
          className={cn(
            "text-xs w-fit rounded-full",
            status.toLowerCase() === "paid"
              ? "bg-green-100 text-green-700"
              : status.toLowerCase() === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700",
          )}
        >
          {status}
        </Badge>
      );
    },
  },

  //   {
  //     header: "Action",
  //     accessorKey: "id",
  //     cell: ({ row }) => {
  //       const productId = row.original.id;
  //       return <ActionCell productId={productId} />;
  //     },
  //   },
];
