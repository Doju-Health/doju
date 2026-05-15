import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/redux/hooks";
import { Product, ApiProduct } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import {
  Shield,
  Truck,
  RotateCcw,
  Heart,
  ChevronRight,
  Star,
  Sparkles,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useGetAProduct } from "./api/use-get-a-product";
import { useGetProducts } from "./api/use-get-products";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";
import { getDeliveryFee, jumiaZone } from "@/data/nigeria-geo";

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
  sellerCity: p.seller?.businessCity ?? undefined,
  approvalStatus: "approved",
  createdAt: new Date(p.createdAt),
});

const StarRating = ({ rating = 4.7 }: { rating?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-muted text-muted"
        }`}
      />
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: apiProduct, isLoading } = useGetAProduct(id!);
  const { data: productsResponse } = useGetProducts({ page: 1, limit: 5 });
  const { data: profileData } = useGetUserProfile();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deliveryCity, setDeliveryCity] = useState<string>("");
  const [wishlisted, setWishlisted] = useState(false);

  const product = apiProduct ? mapApiProduct(apiProduct) : null;

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  // Pre-fill delivery city from saved profile (only once when profile loads)
  useEffect(() => {
    if (profileData?.user?.city) {
      setDeliveryCity((prev) => prev || profileData.user.city || "");
    }
  }, [profileData?.user?.city]);

  const selectedImage =
    product?.images?.[selectedImageIndex] || "/placeholder.svg";
  const thumbnails = (product?.images || [])
    .map((image, index) => ({ image, index }))
    .slice(0, 5);

  const relatedProducts = (productsResponse?.data ?? [])
    .filter((p: ApiProduct) => p.id !== id && p.isActive)
    .slice(0, 4)
    .map(mapApiProduct);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime" />
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

  const sellerCity = apiProduct?.seller?.businessCity ?? null;
  const feeResult =
    deliveryCity && sellerCity
      ? getDeliveryFee(sellerCity, deliveryCity)
      : null;
  const deliveryFee = feeResult?.fee ?? 0;
  const totalToday = product.price * quantity + deliveryFee;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO
        title={`${product.name} - Buy Online`}
        description={`Buy ${product.name} from Doju Health. ${product.description?.slice(0, 120) ?? "Clinical-grade medical equipment from verified sellers in Nigeria."}`.trim()}
        keywords={`${product.name}, ${product.category}, medical equipment Nigeria, buy ${product.name} online`}
        canonical={`/product/${product.id}`}
        ogType="product"
        ogImage={product.images[0] ?? undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images,
          brand: { "@type": "Brand", name: product.brand },
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: product.price,
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: "Doju Health" },
          },
        }}
      />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="container px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-xs overflow-x-auto">
              <Link to="/" className="text-muted-foreground hover:text-foreground whitespace-nowrap">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <Link to="/marketplace" className="text-muted-foreground hover:text-foreground whitespace-nowrap">
                {product.category}
              </Link>
              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* 3-column product section */}
        <section className="py-6 sm:py-10">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-6 xl:gap-10 items-start">

              {/* ── Column 1: Images ── */}
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl border border-border bg-white overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                {thumbnails.length > 1 && (
                  <div className="flex gap-2">
                    {thumbnails.map(({ image, index }) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-16 w-16 rounded-lg border-2 bg-white overflow-hidden flex-shrink-0 transition-colors ${
                          index === selectedImageIndex
                            ? "border-doju-lime"
                            : "border-border hover:border-doju-lime/50"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Column 2: Product info ── */}
              <div className="space-y-5">
                {/* Sold by badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-doju-lime/40 bg-doju-lime/10 px-3 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-doju-lime" />
                  <span className="text-xs font-medium text-doju-lime">
                    Sold by {product.brand} · Verified Seller
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>

                {/* Rating + stock */}
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating />
                  <span className="text-sm font-medium text-foreground">4.7</span>
                  <span className="text-sm text-muted-foreground">(248 reviews)</span>
                  {product.stock > 0 ? (
                    <span className="text-sm font-medium text-doju-lime">In stock</span>
                  ) : (
                    <span className="text-sm font-medium text-destructive">Out of stock</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">VAT incl.</span>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity + action buttons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <div className="flex items-center border border-border rounded-full overflow-hidden">
                      <button
                        className="px-4 py-2 text-lg font-medium hover:bg-muted transition-colors"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-sm font-semibold border-x border-border min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        className="px-4 py-2 text-lg font-medium hover:bg-muted transition-colors"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      variant="doju-primary"
                      className="flex-1 h-11 gap-2"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to cart
                    </Button>
                    <Button
                      variant="doju-outline"
                      className="flex-1 h-11"
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                    >
                      Buy now
                    </Button>
                    <button
                      onClick={() => setWishlisted((w) => !w)}
                      className="h-11 w-11 flex items-center justify-center rounded-lg border border-border hover:border-doju-lime/50 transition-colors flex-shrink-0"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          wishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Feature badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-center">
                    <Truck className="h-5 w-5 text-doju-lime" />
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      Nationwide delivery
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-center">
                    <RotateCcw className="h-5 w-5 text-doju-lime" />
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      7-day returns
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-center">
                    <Shield className="h-5 w-5 text-doju-lime" />
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      Buyer protection
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Column 3: Delivery estimate card ── */}
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                  {/* Card header */}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Sparkles className="h-4 w-4 text-doju-lime" />
                      <h3 className="font-semibold text-foreground text-sm">
                        Delivery Estimate
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      Based on Jumia zones{sellerCity ? ` · from ${sellerCity}` : ""}.
                    </p>
                  </div>

                  {/* City selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Deliver to
                    </label>
                    <select
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="" disabled>Select your city</option>
                      {Object.entries(jumiaZone).map(([zoneName, cities]) => (
                        <optgroup key={zoneName} label={`Zone ${zoneName.replace("ZONE", "")}`}>
                          {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Fee result */}
                  {deliveryCity && (
                    <div className="rounded-xl bg-muted/60 p-3 space-y-1">
                      {feeResult ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Estimated fee</span>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPrice(deliveryFee)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ETA {feeResult.days} business days
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {sellerCity
                            ? "Seller's city is outside standard zones"
                            : "Delivery fee calculated at checkout"}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-border pt-3">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Total today:</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(totalToday)}
                        {!feeResult && deliveryCity && (
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            + delivery
                          </span>
                        )}
                      </span>
                    </div>
                    <Button
                      variant="doju-primary"
                      className="w-full h-11 gap-2"
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                    >
                      Buy now
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
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
