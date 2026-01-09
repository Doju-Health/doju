import { Product } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Star, Users } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-doju-lime/40"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <motion.img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-contain p-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-doju-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
        >
          <p className="text-primary-foreground text-sm line-clamp-2">{product.description}</p>
        </motion.div>

        {product.stock > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
          >
            <Badge className="absolute top-3 right-3 bg-doju-lime text-doju-navy font-semibold shadow-lg">
              In stock
            </Badge>
          </motion.div>
        )}

        {/* Quick view button */}
        <motion.button
          onClick={handleProductClick}
          className="absolute top-3 left-3 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-doju-lime hover:text-doju-navy"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Eye className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-doju-lime">{product.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">4.8</span>
            </div>
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-doju-lime transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        </div>

        {/* Weekly purchases indicator */}
        {product.weeklyPurchases && product.weeklyPurchases > 0 && (
          <motion.div 
            className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-2.5 py-1 w-fit"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Users className="h-3 w-3 text-doju-lime" />
            <span>{product.weeklyPurchases} bought this week</span>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-2">
          <motion.span 
            className="text-xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {formatPrice(product.price)}
          </motion.span>
        </div>

        <div className="flex gap-2 pt-2">
          <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
            <Button
              variant="doju-outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </motion.div>
          <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
            <Button variant="doju-primary" size="sm" className="w-full" onClick={handleProductClick}>
              View
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
