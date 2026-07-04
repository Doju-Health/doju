import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { IProductData } from "@/types";
import { clipSentence, cn, formatPriceAmount } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useApproveProduct } from "../../api/use-approve-product";
import { useDeleteProduct } from "../../api/use-delete-product";

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

const ActionCell = ({ product }: { product: IProductData }) => {
  const navigate = useNavigate();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: approveProduct, isPending: isApprovePending } =
    useApproveProduct();
  const { mutate: deleteProduct, isPending: isDeletePending } =
    useDeleteProduct();

  const handleApprove = () => {
    approveProduct(
      { id: product.id },
      { onSuccess: () => setIsApproveModalOpen(false) },
    );
  };

  const handleDelete = () => {
    deleteProduct(
      { id: product.id, hard: false },
      { onSuccess: () => setIsDeleteModalOpen(false) },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="hover:text-white! cursor-pointer"
            onClick={() => navigate(`/admin/products/${product.id}`)}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="justify-cente"
            onClick={() => setIsApproveModalOpen(true)}
          >
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            className="justify-cente"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this product?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve &quot;{product.name}&quot;. It will
              become visible to buyers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApprovePending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isApprovePending}
            >
              {isApprovePending ? "Approving..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete &quot;{product.name}&quot;. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const getProductsColumns = (): ColumnDef<IProductData>[] => [
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
      const status = row.original.isApproved;
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
      return <ActionCell product={product} />;
    },
  },
];
