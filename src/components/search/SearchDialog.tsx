import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, ArrowRight } from 'lucide-react';
import { allProducts, categories } from '@/data/mockData';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof allProducts>([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm)
    ).slice(0, 6);

    setResults(filtered);
  }, [query]);

  const handleProductClick = (productId: string) => {
    onOpenChange(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    onOpenChange(false);
    setQuery('');
    navigate(`/marketplace?category=${encodeURIComponent(categoryName)}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
    setQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const matchingCategories = query.trim().length >= 2
    ? categories.filter(cat => cat.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products, categories, brands, or SKU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base border-0 focus-visible:ring-0 bg-muted/50"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {query.trim().length < 2 ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4"
              >
                <p className="text-sm text-muted-foreground mb-3">Popular categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map(cat => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-doju-lime hover:text-doju-navy transition-colors py-1.5 px-3"
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-border"
              >
                {/* Matching Categories */}
                {matchingCategories.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {matchingCategories.map(cat => (
                        <Badge
                          key={cat.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-doju-lime hover:text-doju-navy hover:border-doju-lime transition-colors py-1.5 px-3"
                          onClick={() => handleCategoryClick(cat.name)}
                        >
                          {cat.name} ({cat.productCount})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Results */}
                {results.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Products</p>
                    <div className="space-y-2">
                      {results.map(product => (
                        <motion.div
                          key={product.id}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
                          </div>
                          <p className="font-semibold text-doju-lime">{formatPrice(product.price)}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {results.length === 0 && matchingCategories.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium text-foreground">No results found</p>
                    <p className="text-sm text-muted-foreground">Try a different search term</p>
                  </div>
                )}

                {/* View All Results */}
                {results.length > 0 && (
                  <button
                    onClick={handleViewAll}
                    className="w-full p-4 flex items-center justify-center gap-2 text-sm font-medium text-doju-lime hover:bg-muted transition-colors"
                  >
                    View all results for "{query}"
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;