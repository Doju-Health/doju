import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Shield, Truck, Check } from 'lucide-react';

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);

  const shipping = totalAmount > 150 ? 0 : 10;
  const tax = totalAmount * 0.08;
  const total = totalAmount + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the payment
    setIsComplete(true);
    clearCart();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-doju-navy">
                <span className="text-sm font-bold text-primary-foreground">DJ</span>
              </div>
              <span className="text-xl font-bold text-foreground">Doju</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-doju-lime flex items-center justify-center">
                <Check className="h-10 w-10 text-doju-navy" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Order placed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We've sent a confirmation email with your order details and tracking information.
            </p>
            <p className="text-lg font-semibold text-foreground mb-8">
              Order #DJ-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <div className="space-y-3">
              <Link to="/marketplace">
                <Button variant="doju-primary" size="lg" className="w-full">
                  Continue shopping
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  Back to home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-doju-navy">
              <span className="text-sm font-bold text-primary-foreground">DJ</span>
            </div>
            <span className="text-xl font-bold text-foreground">Doju</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/cart">
              <Button variant="doju-outline" size="sm">Back to cart</Button>
            </Link>
            <Button variant="ghost" size="sm">Need help?</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Contact information</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" className="h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" className="h-12" required />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Shipping address</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" placeholder="Alex Johnson" className="h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="1234 Wellness Ave" className="h-12" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="San Francisco" className="h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="CA" className="h-12" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal code</Label>
                      <Input id="postal" placeholder="94107" className="h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="United States" className="h-12" required />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-doju-lime text-doju-navy">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm font-medium">Estimated delivery in 3-5 days</span>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder name</Label>
                    <Input id="cardName" placeholder="Alex Johnson" className="h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input id="cardNumber" placeholder="•••• •••• •••• 4242" className="h-12" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="08 / 28" className="h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="•••" className="h-12" required />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Payments are encrypted and PCI compliant</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-card p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Order summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.product.sku} • Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? 'Free over $150' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Input placeholder="Enter promo code" className="flex-1" />
                  <Button type="button" variant="outline">Apply</Button>
                </div>

                <Button type="submit" variant="doju-primary" size="lg" className="w-full mt-4">
                  Place order
                </Button>

                <Link to="/marketplace">
                  <Button type="button" variant="ghost" className="w-full mt-2">
                    Continue shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
