import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartCheckoutBar from '@/components/cart/CartCheckoutBar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { allProducts as mockProducts, featuredProducts } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { Shield, Truck, RotateCcw, Heart, ChevronRight, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // First check mock products
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        setProduct(mockProduct);
        setLoading(false);
        return;
      }

      // Then check database
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();

        if (error || !data) {
          setProduct(null);
          setLoading(false);
          return;
        }

        // Fetch media
        const { data: mediaData } = await supabase
          .from('product_media')
          .select('*')
          .eq('product_id', data.id);

        const dbProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: Number(data.price),
          images: mediaData?.filter(m => m.type === 'image').map(m => m.url) || [],
          category: data.category || 'Other',
          brand: 'DOJU Seller',
          sku: `DB-${data.id.slice(0, 8)}`,
          stock: data.stock,
          sellerId: data.seller_id,
          approvalStatus: 'approved',
          createdAt: new Date(data.created_at),
        };
        setProduct(dbProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const relatedProducts = featuredProducts.filter(p => p.id !== id).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <div className="container px-4 sm:px-6 py-3 sm:py-4">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-x-auto">
              <Link to="/" className="text-muted-foreground hover:text-foreground whitespace-nowrap">Home</Link>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <Link to="/marketplace" className="text-muted-foreground hover:text-foreground whitespace-nowrap">{product.category}</Link>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate">{product.name}</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-2">Product details</h1>
          </div>
        </div>

        {/* Product Info */}
        <section className="py-6 sm:py-8">
          <div className="container px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Images */}
              <div className="space-y-3 sm:space-y-4">
                <div className="aspect-square rounded-xl border border-border bg-muted overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, i) => (
                    <div key={i} className="aspect-square rounded-lg border border-border bg-muted overflow-hidden cursor-pointer hover:border-doju-lime transition-colors">
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`${product.name} view ${i + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                  {product.images.length < 4 && [...Array(4 - product.images.length)].map((_, i) => (
                    <div key={`placeholder-${i}`} className="aspect-square rounded-lg border border-border bg-muted overflow-hidden cursor-pointer hover:border-doju-lime transition-colors">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={`${product.name} view`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{product.brand} • SKU: {product.sku}</p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1">{product.name}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">(248 reviews)</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Category</p>
                    <p className="text-xs sm:text-sm font-medium">{product.category}</p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Brand</p>
                    <p className="text-xs sm:text-sm font-medium">{product.brand}</p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Warranty</p>
                    <p className="text-xs sm:text-sm font-medium">2 years</p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Stock</p>
                    <p className="text-xs sm:text-sm font-medium">{product.stock} units</p>
                  </div>
                </div>

                {/* Stock status */}
                {product.stock > 0 && (
                  <div className="bg-doju-lime text-doju-navy rounded-lg py-2 px-4 text-center text-sm sm:text-base font-medium">
                    In stock • Ships in 24h
                  </div>
                )}

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground">{product.description}</p>

                {/* Price Card */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                  <div className="flex flex-wrap items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">VAT included where applicable</span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <label className="text-xs sm:text-sm text-muted-foreground">Quantity</label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 hover:bg-muted transition-colors text-sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-border text-sm">{quantity}</span>
                      <button
                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 hover:bg-muted transition-colors text-sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    Free shipping over $100 • Delivery ETA: 3-5 days
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Button variant="doju-outline" className="flex-1 h-10 sm:h-11 text-sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Add to wishlist
                    </Button>
                    {user ? (
                      <Button
                        variant="doju-primary"
                        className="flex-1 h-10 sm:h-11 text-sm"
                        onClick={() => addToCart(product, quantity)}
                      >
                        Add to cart
                      </Button>
                    ) : (
                      <Button
                        variant="doju-primary"
                        className="flex-1 gap-2 h-10 sm:h-11 text-sm"
                        onClick={() => {
                          toast.info("Sign in to add items to your cart");
                          navigate(`/auth?returnTo=/product/${id}`);
                        }}
                      >
                        <LogIn className="h-4 w-4" />
                        Sign in to buy
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1 text-doju-lime" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Verified vendor</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1 text-doju-lime" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Secure payments</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1 text-doju-lime" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">30-day returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <CartCheckoutBar />
      <Footer />
    </div>
  );
};

export default ProductDetail;
