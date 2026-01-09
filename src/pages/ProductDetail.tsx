import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { allProducts, featuredProducts } from '@/data/mockData';
import ProductCard from '@/components/products/ProductCard';
import { Shield, Truck, RotateCcw, Heart, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find(p => p.id === id);
  const relatedProducts = featuredProducts.filter(p => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/marketplace">
              <Button variant="doju-primary">Back to marketplace</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link to="/marketplace" className="text-muted-foreground hover:text-foreground">{product.category}</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{product.name}</span>
            </nav>
            <h1 className="text-2xl font-bold text-foreground mt-2">Product details</h1>
          </div>
        </div>

        {/* Product Info */}
        <section className="py-8">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square rounded-xl border border-border bg-muted overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-lg border border-border bg-muted overflow-hidden cursor-pointer hover:border-doju-lime transition-colors">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={`${product.name} view ${i}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">{product.brand} • SKU: {product.sku}</p>
                  <h2 className="text-3xl font-bold text-foreground mt-1">{product.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">(248 reviews)</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Material</p>
                    <p className="text-sm font-medium">Stainless steel</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Tubing</p>
                    <p className="text-sm font-medium">Latex-free PVC</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Warranty</p>
                    <p className="text-sm font-medium">2 years</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-sm font-medium">150g</p>
                  </div>
                </div>

                {/* Stock status */}
                {product.stock > 0 && (
                  <div className="bg-doju-lime text-doju-navy rounded-lg py-2 px-4 text-center font-medium">
                    In stock • Ships in 24h
                  </div>
                )}

                {/* Description */}
                <p className="text-muted-foreground">{product.description}</p>

                {/* Price Card */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
                    <span className="text-sm text-muted-foreground">VAT included where applicable</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm text-muted-foreground">Quantity</label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        className="px-3 py-2 hover:bg-muted transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-border">{quantity}</span>
                      <button
                        className="px-3 py-2 hover:bg-muted transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Free shipping over $100 • Delivery ETA: 3-5 days
                  </p>

                  <div className="flex gap-3 mb-4">
                    <Button variant="doju-outline" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Add to wishlist
                    </Button>
                    <Button
                      variant="doju-primary"
                      className="flex-1"
                      onClick={() => addToCart(product, quantity)}
                    >
                      Add to cart
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Shield className="h-5 w-5 mx-auto mb-1 text-doju-lime" />
                      <p className="text-xs text-muted-foreground">Verified vendor</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Truck className="h-5 w-5 mx-auto mb-1 text-doju-lime" />
                      <p className="text-xs text-muted-foreground">Secure payments</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <RotateCcw className="h-5 w-5 mx-auto mb-1 text-doju-lime" />
                      <p className="text-xs text-muted-foreground">30-day returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
