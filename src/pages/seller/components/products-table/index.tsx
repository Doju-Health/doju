import { DataTableWrapper, DataTable } from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";
import { useGetSellersProducts } from "../../api/use-get-seller-products";
import { useMemo } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";

export const ProductTable = () => {
  const filters = { page: 1, limit: 10 };
  const getSellerProducts = useGetSellersProducts(filters);
  const { data: sellerProducts } = getSellerProducts || {};

  const memoizedSellerProducts = useMemo(
    () => sellerProducts,
    [sellerProducts],
  );
  const columns = getProductsColumns();
  return (
    <QueryWrapper currentQuery={getSellerProducts}>
      <DataTableWrapper className="">
        <DataTable columns={columns} data={memoizedSellerProducts} />
      </DataTableWrapper>
    </QueryWrapper>
  );
};
