import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTable } from "../../components/products-table";
import { CreateProductModal } from "../../components/modal/create-product-modal";

interface ProductsTabProps {
  onAddProduct?: () => void;
  onEditProduct?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function ProductsTab({ onAddProduct }: ProductsTabProps) {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Your Products</h2>
        <CreateProductModal>
          <Button
            variant="doju-primary"
            size="sm"
            className="gap-2"
            onClick={onAddProduct}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </CreateProductModal>
      </div>

      <div className="flex-1 min-h-0">
        <ProductTable />
      </div>
    </div>
  );
}
