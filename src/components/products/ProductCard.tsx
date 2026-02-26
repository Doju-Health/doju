import { Product } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Star, Users } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleProductClick}
      className="group rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-doju-lime/40 cursor-pointer active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative aspect-square sm:aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay on hover - hidden on mobile for performance */}
        <div className="absolute inset-0 bg-gradient-to-t from-doju-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end p-3 sm:p-4 hidden sm:flex">
          <p className="text-primary-foreground text-xs sm:text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        {product.stock > 0 && (
          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-doju-lime text-doju-navy font-semibold shadow-lg text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
            In stock
          </Badge>
        )}

        {/* Quick view button - visible on hover desktop only */}
        <button
          onClick={handleProductClick}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-card/90 backdrop-blur-sm items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-doju-lime hover:text-doju-navy hidden sm:flex"
        >
          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-medium text-doju-lime truncate">
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                4.8
              </span>
            </div>
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-doju-lime transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
            SKU: {product.sku}
          </p>
        </div>

        {/* Weekly purchases indicator */}
        {product.weeklyPurchases && product.weeklyPurchases > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground bg-muted/50 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 w-fit">
            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-doju-lime flex-shrink-0" />
            <span className="truncate">
              {product.weeklyPurchases} bought this week
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <span className="text-lg sm:text-xl font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          <div className="flex-1">
            <Button
              variant="doju-outline"
              size="sm"
              className="w-full gap-1 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                toast.success("Added to cart");
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add</span>
            </Button>
          </div>
          <div className="flex-1">
            <Button
              variant="doju-primary"
              size="sm"
              className="w-full h-9 sm:h-10 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick();
              }}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
