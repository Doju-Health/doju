import { DataTableWrapper, DataTable } from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";
import { useGetSellersProducts } from "@/pages/seller/api/use-get-seller-products";
import { useMemo, useState } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { IProductData } from "@/types";
import { useGetAdminProducts } from "../../api/use-get-products";

export const AdminProductTable = () => {
  const filters = { page: 1, limit: 10 };
  const getAdminProducts = useGetAdminProducts(filters);
  const { data: adminProducts } = getAdminProducts || {};
  const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const memoizedAdminProducts = useMemo(
    () => adminProducts?.data,
    [adminProducts?.data],
  );
  const columns = getProductsColumns((product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  });

  return (
    <>
      <QueryWrapper currentQuery={getAdminProducts}>
        <DataTableWrapper className="">
          <DataTable columns={columns} data={memoizedAdminProducts ?? []} />
        </DataTableWrapper>
      </QueryWrapper>
    </>
  );
};
