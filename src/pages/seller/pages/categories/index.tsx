import { Button } from "@/components/ui/button";
import { CategoresTable } from "../../components/categories-table/categories-table";
import { CreateCategoryModal } from "../../components/modal/create-category-modal";

export default function Categories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        <CreateCategoryModal>
          <Button variant="doju-primary">Add Category</Button>
        </CreateCategoryModal>
      </div>

      <CategoresTable />
    </div>
  );
}
