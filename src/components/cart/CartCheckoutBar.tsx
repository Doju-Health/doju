import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const CartCheckoutBar = () => {
  const { totalItems, totalAmount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl"
        >
          <div className="container py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-doju-lime/20 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-doju-lime" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                  </p>
                  <p className="font-bold text-foreground">{formatPrice(totalAmount)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link to="/cart">
                  <Button variant="doju-outline" size="sm" className="hidden sm:flex">
                    View Cart
                  </Button>
                </Link>
                <Link to="/checkout">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button variant="doju-primary" size="sm" className="gap-2">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartCheckoutBar;
