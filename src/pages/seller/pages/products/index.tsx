import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ProductTable } from "../../components/products-table";
import { CreateProductModal } from "../../components/modal/create-product-modal";

const STATIC_PRODUCTS = [
  {
    id: "1",
    name: "Digital Blood Pressure Monitor",
    description: "Accurate and easy-to-use blood pressure monitoring device",
    price: 12500,
    stock: 45,
    category: "Medical Devices",
    status: "approved",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Wireless Thermometer",
    description:
      "Fast and accurate temperature measurement with wireless connectivity",
    price: 8750,
    stock: 32,
    category: "Medical Devices",
    status: "pending",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Pulse Oximeter",
    description: "Non-invasive oxygen saturation monitor",
    price: 9200,
    stock: 28,
    category: "Medical Devices",
    status: "approved",
    image:
      "https://images.unsplash.com/photo-1631217314830-c63e6f1863f7?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Digital Glucose Meter",
    description: "Quick blood glucose level testing device",
    price: 6500,
    stock: 56,
    category: "Medical Devices",
    status: "approved",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop",
  },
];

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

const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString("en-NG")}`;
};

interface ProductsTabProps {
  onAddProduct?: () => void;
  onEditProduct?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function ProductsTab({
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsTabProps) {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">
          Your Products ({STATIC_PRODUCTS.length})
        </h2>
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
