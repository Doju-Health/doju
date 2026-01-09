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
        <div className="container py-8">
          <h1 className="text-2xl font-bold text-foreground mb-8">Shopping Cart ({items.length} items)</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="h-24 w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                        <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          className="px-3 py-1.5 hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1.5 border-x border-border text-sm">{item.quantity}</span>
                        <button
                          className="px-3 py-1.5 hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
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
              <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">Order summary</h2>

                <div className="space-y-3 text-sm">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                      <span className="text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border my-4" />

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

                <div className="border-t border-border my-4" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mt-6">
                  <Input placeholder="Enter promo code" className="flex-1" />
                  <Button variant="outline">Apply</Button>
                </div>

                <Link to="/checkout" className="block mt-4">
                  <Button variant="doju-primary" size="lg" className="w-full">
                    Proceed to checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link to="/marketplace">
                  <Button variant="ghost" className="w-full mt-2">
                    Continue shopping
                  </Button>
                </Link>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
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
