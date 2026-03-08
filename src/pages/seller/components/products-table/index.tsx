import { DataTableWrapper, DataTable } from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";
import { useGetSellersProducts } from "../../api/use-get-seller-products";
import { useMemo, useState } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { IProductData } from "@/types";
import { CreateProductModal } from "../modal/create-product-modal";

export const ProductTable = () => {
  const filters = { page: 1, limit: 10 };
  const getSellerProducts = useGetSellersProducts(filters);
  const { data: sellerProducts } = getSellerProducts || {};
  const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const memoizedSellerProducts = useMemo(
    () => sellerProducts,
    [sellerProducts],
  );
  const columns = getProductsColumns((product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  });

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
    </>
  );
};
