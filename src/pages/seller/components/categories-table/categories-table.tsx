import { DataTable, DataTableWrapper } from "@/components/ui/table";
import { getCategoriesColumns } from "./categories-table-column";
import { useGetCategories } from "../../api/use-get-categories";
import { useMemo, useState } from "react";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { CategoryDetailsModal } from "../modal/category-details-modal";

export const CategoresTable = () => {
  const getCategories = useGetCategories();
  const { data: categories } = getCategories || {};
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const columns = getCategoriesColumns((categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsDetailsOpen(true);
  });

  const memoizedCategories = useMemo(() => categories, [categories]);
  return (
    <>
      <QueryWrapper currentQuery={getCategories}>
        <DataTableWrapper>
          <DataTable columns={columns} data={memoizedCategories ?? []} />
        </DataTableWrapper>
      </QueryWrapper>

      {selectedCategoryId && (
        <CategoryDetailsModal
          categoryId={selectedCategoryId}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  );
};
