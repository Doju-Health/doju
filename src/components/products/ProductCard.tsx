import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-doju-lime/30">
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock > 0 && (
          <Badge className="absolute top-3 right-3 bg-doju-lime text-doju-navy font-medium">
            In stock
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="doju-outline"
            size="sm"
            className="flex-1"
            onClick={() => addToCart(product)}
          >
            Add to cart
          </Button>
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button variant="doju-primary" size="sm" className="w-full">
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
