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

export const ProductsTab = ({
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Your Products ({STATIC_PRODUCTS.length})
        </h2>
        <Button
          variant="doju-primary"
          size="sm"
          className="gap-2"
          onClick={onAddProduct}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {STATIC_PRODUCTS.length > 0 ? (
        <div className="grid gap-4">
          {STATIC_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-doju-lime font-medium">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stock: {product.stock} • {product.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusBadge(product.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEditProduct?.(product.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDeleteProduct?.(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground rounded-2xl border border-border bg-card p-8">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-sm mb-4">
            Start selling by adding your first product.
          </p>
          <Button variant="doju-primary" onClick={onAddProduct}>
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};
