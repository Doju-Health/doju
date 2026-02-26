import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartCheckoutBar from "@/components/cart/CartCheckoutBar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/redux/hooks";
import { Product, ApiProduct } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { Shield, Truck, RotateCcw, Heart, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useGetAProduct } from "./api/use-get-a-product";
import { useGetProducts } from "./api/use-get-products";

/** Map an API product to the internal Product shape used by ProductCard & cart */
const mapApiProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: Number(p.price),
  images: p.imageUrl?.filter(Boolean) ?? [],
  category: p.category?.name ?? "Other",
  brand: p.seller?.fullName ?? "DOJU Seller",
  sku: `DB-${p.id.slice(0, 8)}`,
  stock: p.stock,
  sellerId: p.seller?.id ?? "",
  approvalStatus: "approved",
  createdAt: new Date(p.createdAt),
});

const ProductDetail = () => {
  const { id } = useParams();
  const { data: apiProduct, isLoading } = useGetAProduct(id!);
  const { data: productsResponse } = useGetProducts({ page: 1, limit: 5 });
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = apiProduct ? mapApiProduct(apiProduct) : null;

  // Related products: other products from the same response, excluding current
  const relatedProducts = (productsResponse?.data ?? [])
    .filter((p: ApiProduct) => p.id !== id && p.isActive)
    .slice(0, 4)
    .map(mapApiProduct);

  if (isLoading) {
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
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
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
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Home
              </Link>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <Link
                to="/marketplace"
                className="text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                {product.category}
              </Link>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate">{product.name}</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
              Product details
            </h1>
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
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border border-border bg-muted overflow-hidden cursor-pointer hover:border-doju-lime transition-colors"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} view ${i + 2}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Sold by {product.brand} • {product.category}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1">
                    {product.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    (248 reviews)
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Category
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      {product.category}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Seller
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      {product.brand}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Warranty
                    </p>
                    <p className="text-xs sm:text-sm font-medium">2 years</p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Stock
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      {product.stock} units
                    </p>
                  </div>
                </div>

                {/* Stock status */}
                {product.stock > 0 && (
                  <div className="bg-doju-lime text-doju-navy rounded-lg py-2 px-4 text-center text-sm sm:text-base font-medium">
                    In stock • Ships in 24h
                  </div>
                )}

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground">
                  {product.description}
                </p>

                {/* Price Card */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                  <div className="flex flex-wrap items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      VAT included where applicable
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <label className="text-xs sm:text-sm text-muted-foreground">
                      Quantity
                    </label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 hover:bg-muted transition-colors text-sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-border text-sm">
                        {quantity}
                      </span>
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
                    <Button
                      variant="doju-outline"
                      className="flex-1 h-10 sm:h-11 text-sm"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Add to wishlist
                    </Button>
                    <Button
                      variant="doju-primary"
                      className="flex-1 h-10 sm:h-11 text-sm"
                      onClick={() => {
                        addToCart(product, quantity);
                        toast.success("Added to cart");
                      }}
                    >
                      Add to cart
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1 text-doju-lime" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Verified vendor
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1 text-doju-lime" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Secure payments
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-0.5 sm:mb-1 text-doju-lime" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        30-day returns
                      </p>
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
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">
              You may also like
            </h2>
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
