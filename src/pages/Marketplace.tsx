import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import CartCheckoutBar from "@/components/cart/CartCheckoutBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { allProducts as mockProducts, categories } from "@/data/mockData";
import { Product } from "@/types";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null,
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  // Fetch approved products from database
  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select("*")
          .eq("status", "approved");

        if (error) throw error;

        if (products && products.length > 0) {
          // Fetch media for products
          const productIds = products.map((p) => p.id);
          const { data: mediaData } = await supabase
            .from("product_media")
            .select("*")
            .in("product_id", productIds);

          const productsWithMedia: Product[] = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description || "",
            price: Number(product.price),
            images:
              mediaData
                ?.filter(
                  (m) => m.product_id === product.id && m.type === "image",
                )
                .map((m) => m.url) || [],
            category: product.category || "Other",
            brand: "DOJU Seller",
            sku: `DB-${product.id.slice(0, 8)}`,
            stock: product.stock,
            sellerId: product.seller_id,
            approvalStatus: "approved" as const,
            createdAt: new Date(product.created_at),
          }));
          setDbProducts(productsWithMedia);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchApprovedProducts();
  }, []);

  // Combine mock products with database products
  const allProducts = useMemo(() => {
    return [...mockProducts, ...dbProducts];
  }, [dbProducts]);

  // Sync URL params to state
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlCategory = searchParams.get("category");

    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
    if (urlCategory !== null) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Get unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(allProducts.map((p) => p.brand))];
    return uniqueBrands.sort();
  }, [allProducts]);

  // Get price range from products
  const maxPrice = useMemo(() => {
    return allProducts.length > 0
      ? Math.max(...allProducts.map((p) => p.price))
      : 500000;
  }, [allProducts]);

  // Filter only approved products for display
  const approvedProducts = useMemo(() => {
    return allProducts.filter((p) => p.approvalStatus === "approved");
  }, [allProducts]);

  const filteredProducts = approvedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSearchParams({});
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <motion.div
          className="border-b border-border bg-gradient-to-r from-doju-navy to-doju-navy-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container py-6 sm:py-10 px-4 sm:px-6">
            <motion.nav
              className="flex items-center gap-2 text-xs sm:text-sm mb-3 sm:mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-primary-foreground/60">Home</span>
              <span className="text-primary-foreground/60">/</span>
              <span className="text-primary-foreground">Products</span>
            </motion.nav>
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">
                  {selectedCategory || "All Products"}
                </h1>
                <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
                  {filteredProducts.length} products available
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 h-9 sm:h-10 text-xs sm:text-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1.5 sm:mr-2" />
                  Filters
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container py-4 sm:py-8 px-4 sm:px-6">
          <div className="grid lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Sidebar Filters */}
            <AnimatePresence>
              <motion.aside
                className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 h-12 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Categories */}
                <motion.div
                  className="rounded-2xl border border-border bg-card p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-bold text-foreground mb-4">Categories</h3>
                  <div className="space-y-1">
                    <motion.button
                      onClick={() => setSelectedCategory(null)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                        !selectedCategory
                          ? "bg-doju-lime text-doju-navy font-semibold"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-xs">{approvedProducts.length}</span>
                    </motion.button>
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                          selectedCategory === category.name
                            ? "bg-doju-lime text-doju-navy font-semibold"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-xs">{category.productCount}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Brands */}
                <motion.div
                  className="rounded-2xl border border-border bg-card p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-bold text-foreground mb-4">Brands</h3>
                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <motion.button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                          selectedBrands.includes(brand)
                            ? "bg-doju-lime text-doju-navy font-semibold"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{brand}</span>
                        <span className="text-xs">
                          {
                            approvedProducts.filter((p) => p.brand === brand)
                              .length
                          }
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Price Range */}
                <motion.div
                  className="rounded-2xl border border-border bg-card p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-bold text-foreground mb-4">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <Slider
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={(value) =>
                        setPriceRange([value[0], value[1]])
                      }
                      min={0}
                      max={maxPrice}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive/80 w-full"
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset all filters
                  </Button>
                </motion.div>
              </motion.aside>
            </AnimatePresence>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-muted-foreground">
                  Showing 1-{Math.min(12, filteredProducts.length)} of{" "}
                  {filteredProducts.length} results
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by</span>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Most relevant
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>

              {/* Active Filters */}
              <AnimatePresence>
                {(selectedCategory ||
                  searchQuery ||
                  selectedBrands.length > 0 ||
                  priceRange[0] > 0 ||
                  priceRange[1] < maxPrice) && (
                  <motion.div
                    className="flex flex-wrap gap-2 mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {selectedCategory && (
                      <Badge
                        variant="secondary"
                        className="gap-1 py-1.5 px-3 rounded-full"
                      >
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="gap-1 py-1.5 px-3 rounded-full"
                      >
                        "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedBrands.map((brand) => (
                      <Badge
                        key={brand}
                        variant="secondary"
                        className="gap-1 py-1.5 px-3 rounded-full"
                      >
                        {brand}
                        <button
                          onClick={() => toggleBrand(brand)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <Badge
                        variant="secondary"
                        className="gap-1 py-1.5 px-3 rounded-full"
                      >
                        {formatPrice(priceRange[0])} -{" "}
                        {formatPrice(priceRange[1])}
                        <button
                          onClick={() => setPriceRange([0, maxPrice])}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredProducts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-16 rounded-2xl border border-dashed border-border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    No products found
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="doju-primary" onClick={clearAllFilters}>
                    Clear filters
                  </Button>
                </motion.div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <motion.div
                  className="flex items-center justify-between mt-12 pt-8 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground">Page 1 of 1</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="rounded-xl"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="doju-primary"
                      size="sm"
                      className="rounded-xl"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <CartCheckoutBar />
      <Footer />
    </div>
  );
};

export default Marketplace;
