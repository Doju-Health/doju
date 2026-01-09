import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { allProducts, categories } from '@/data/mockData';
import { Search, Filter, ChevronDown } from 'lucide-react';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="container py-6">
            <nav className="flex items-center gap-2 text-sm mb-2">
              <span className="text-muted-foreground">Home</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">Products</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {selectedCategory || 'All Products'} — {filteredProducts.length} products
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  All Filters
                </Button>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  In stock
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  Price: $50-$200
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory ? 'bg-doju-lime-pale text-doju-navy font-medium' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <span>All Categories</span>
                    <span>{allProducts.length}</span>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.name ? 'bg-doju-lime-pale text-doju-navy font-medium' : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span>{category.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Brands</h3>
                <div className="space-y-2">
                  {['OmniCare', 'PulseCheck', 'AeroMed', 'ThermaCo'].map((brand) => (
                    <button
                      key={brand}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <span>{brand}</span>
                      <span>{Math.floor(Math.random() * 20) + 5}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Price</h3>
                <div className="space-y-2">
                  {['Under $50', '$50–$200', '$200–$500', '$500+'].map((range) => (
                    <button
                      key={range}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <span>{range}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="link" className="text-destructive p-0 h-auto">
                Reset filters
              </Button>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing 1-{Math.min(12, filteredProducts.length)} of {filteredProducts.length} results
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort</span>
                  <Button variant="outline" size="sm">
                    Most relevant
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
                <Badge variant="secondary">In stock</Badge>
                <Badge variant="secondary">Free shipping</Badge>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No products found</p>
                  <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                    Clear filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">Page 1 of 1</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="doju-primary" size="sm">1</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
