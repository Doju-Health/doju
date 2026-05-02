import { DataTableWrapper, DataTable } from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";
import { useGetSellersProducts } from "../../api/use-get-seller-products";
import { useMemo, useState } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { IProductData } from "@/types";
import { CreateProductModal } from "../modal/create-product-modal";
import { useDeleteProduct } from "../../api/use-delete-product";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ProductTable = () => {
  const filters = { page: 1, limit: 10 };
  const getSellerProducts = useGetSellersProducts(filters);
  const { data: sellerProducts } = getSellerProducts || {};
  const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState<IProductData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const memoizedSellerProducts = useMemo(
    () => sellerProducts,
    [sellerProducts],
  );
  const columns = getProductsColumns(
    (product) => {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    },
    (product) => {
      setSelectedProductToDelete(product);
      setIsDeleteDialogOpen(true);
    },
  );

  return (
    <>
      <QueryWrapper currentQuery={getSellerProducts}>
        <DataTableWrapper className="">
          <DataTable columns={columns} data={memoizedSellerProducts} />
        </DataTableWrapper>
      </QueryWrapper>

      <CreateProductModal
        mode="edit"
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialProduct={selectedProduct}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedProductToDelete(null);
          setIsDeleteDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedProductToDelete?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              disabled={isDeleting || !selectedProductToDelete}
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => {
                if (!selectedProductToDelete) return;
                deleteProduct(selectedProductToDelete.id, {
                  onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProductToDelete(null);
                  },
                });
              }}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
