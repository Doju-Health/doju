import { DataTableWrapper, DataTable } from "@/components/ui/table";
import { getProductsColumns } from "./product-table-column";
import { useMemo } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetAdminProducts } from "../../api/use-get-products";

export const AdminProductTable = () => {
  const filters = { page: 1, limit: 10 };
  const getAdminProducts = useGetAdminProducts(filters);
  const { data: adminProducts } = getAdminProducts || {};

  const memoizedAdminProducts = useMemo(
    () => adminProducts?.data,
    [adminProducts?.data],
  );
  const columns = getProductsColumns();

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
