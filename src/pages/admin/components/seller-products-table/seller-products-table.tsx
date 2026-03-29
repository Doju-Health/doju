import { DataTable, DataTableWrapper } from "@/components/ui/table";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { IProductData } from "@/types";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetSellerProducts } from "../../api/use-get-seller-products";
import { getSellerProductsColumns } from "./seller-products-table-column";

type AdminSellerProductsTableProps = {
  sellerId?: string;
};

export const AdminSellerProductsTable = ({
  sellerId,
}: AdminSellerProductsTableProps) => {
  const { id } = useParams();
  const effectiveSellerId = sellerId ?? id ?? "";

  const filters = {
    page: 1,
    size: 10,
  };

  const getSellerProducts = useGetSellerProducts(effectiveSellerId, filters);
  const payload = getSellerProducts.data as
    | { data?: IProductData[] }
    | IProductData[]
    | undefined;
  const sellerProducts = useMemo(() => {
    if (!payload) return [];
    return Array.isArray(payload) ? payload : (payload.data ?? []);
  }, [payload]);

  const columns = getSellerProductsColumns();

  return (
    <QueryWrapper currentQuery={getSellerProducts}>
      <DataTableWrapper>
        <DataTable data={sellerProducts} columns={columns} />
      </DataTableWrapper>
    </QueryWrapper>
  );
};
