import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IProductData } from "@/types";
import { clipSentence, cn, formatPriceAmount } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const ActionCell = ({
  product,
  onEdit,
  onDelete,
}: {
  product: IProductData;
  onEdit?: (product: IProductData) => void;
  onDelete?: (product: IProductData) => void;
}) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:text-white! cursor-pointer"
          onClick={() => navigate(`/seller/products/${product.id}`)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="justify-cente"
          onClick={() => onEdit?.(product)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive justify-cente"
          onClick={() => onDelete?.(product)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getProductsColumns = (
  onEdit?: (product: IProductData) => void,
  onDelete?: (product: IProductData) => void,
): // onViewDetails,
ColumnDef<IProductData>[] => [
  {
    header: "PRODUCT",
    accessorKey: "product",
    cell: ({ row }) => {
      const product = row.original.name;
      const productDescription = row.original.description;
      const productImage = row.original.imageUrl[0];
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
    header: "CATEGORY",
    accessorKey: "category",
    cell: ({ row }) => {
      const category = row.original.category.name;

      return <h3>{category}</h3>;
    },
  },

  {
    header: "STOCK",
    accessorKey: "stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return <p className="">{stock}</p>;
    },
  },
  {
    header: "SIZE",
    accessorKey: "size",
    cell: ({ row }) => {
      const size = row.original.size;
      return <p className="capitalize">{size}</p>;
    },
  },
  {
    header: "PRICE",
    accessorKey: "price",
    cell: ({ row }) => {
      const price = row.original.price;
      return <p className="">{formatPriceAmount(price)}</p>;
    },
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.isActive;
      return (
        <p
          className={cn(
            "px-2 text-xs py-1 w-fit rounded-full ",
            status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
          )}
        >
          {status ? "Active" : "Inactive"}
        </p>
      );
    },
  },

  {
    header: "ACTION",
    accessorKey: "id",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <ActionCell product={product} onEdit={onEdit} onDelete={onDelete} />
      );
    },
  },
];
