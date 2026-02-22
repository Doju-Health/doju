import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { IProductData } from "@/types";
import { clipSentence } from "@/lib/utils";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};
export const getProductsColumns = (): // onViewDetails,
ColumnDef<IProductData>[] => [
  {
    header: "Product",
    accessorKey: "product",
    cell: ({ row }) => {
      const product = row.original.name;
      const productDescription = row.original.description;
      const productImage = row.original.imageUrl;
      return (
        <div className="flex gap-2">
          <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
            <img
              src={productImage}
              alt={product}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-semibold">{product}</h2>
            <p>{clipSentence(productDescription, 30)}</p>
          </div>
        </div>
      );
    },
  },

  {
    header: "Category",
    accessorKey: "category",
    cell: ({ row }) => {
      const category = row.original.category.name;

      return <h3>{category}</h3>;
    },
  },

  {
    header: "Stock",
    accessorKey: "stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return <p className="">{stock}</p>;
    },
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => {
      const price = row.original.price;
      return <p className="">{price}</p>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return getStatusBadge(status);
    },
  },

  {
    header: "Action",
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="hover:text-white!">
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="justify-cente">Edit</DropdownMenuItem>

            <DropdownMenuItem className="justify-cente">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
