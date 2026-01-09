import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shipping = totalAmount > 150 ? 0 : 10;
  const tax = totalAmount * 0.08;
  const total = totalAmount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Browse our products and add items to your cart.</p>
            <Link to="/marketplace">
              <Button variant="doju-primary" size="lg">
                Browse products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-4 sm:py-8 px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-8">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="rounded-xl border border-border bg-card p-3 sm:p-4">
                  {/* Mobile: Stack layout, Desktop: Side by side */}
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                          <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground hidden sm:block">SKU: {item.product.sku}</p>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-foreground whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Quantity and Remove - Full width on mobile */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border sm:border-0 sm:pt-0 sm:mt-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        className="px-2.5 sm:px-3 py-1.5 hover:bg-muted transition-colors active:bg-muted"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 sm:px-4 py-1.5 border-x border-border text-sm min-w-[40px] text-center">{item.quantity}</span>
                      <button
                        className="px-2.5 sm:px-3 py-1.5 hover:bg-muted transition-colors active:bg-muted"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-9 px-2 sm:px-3"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  Clear cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 sticky top-20 sm:top-24">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Order summary</h2>

                <div className="space-y-2 sm:space-y-3 text-sm max-h-32 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between gap-2">
                      <span className="text-muted-foreground truncate flex-1">{item.product.name} × {item.quantity}</span>
                      <span className="text-foreground whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border my-3 sm:my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="border-t border-border my-3 sm:my-4" />

                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mt-4 sm:mt-6">
                  <Input placeholder="Promo code" className="flex-1 h-10" />
                  <Button variant="outline" className="h-10 px-3 sm:px-4">Apply</Button>
                </div>

                <Link to="/checkout" className="block mt-3 sm:mt-4">
                  <Button variant="doju-primary" size="lg" className="w-full h-12">
                    Proceed to checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link to="/marketplace">
                  <Button variant="ghost" className="w-full mt-2 h-10">
                    Continue shopping
                  </Button>
                </Link>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4">
                    Add {formatPrice(150 - totalAmount)} more for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
