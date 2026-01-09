import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

interface TopSellingCarouselProps {
  topProducts: Product[];
}

const TopSellingCarousel = ({ topProducts }: TopSellingCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 sm:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <Badge className="mb-2 sm:mb-3 bg-doju-lime/10 text-doju-lime border-doju-lime/20 text-xs">
              Best Sellers
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Top Selling Products
            </h2>
            <p className="text-muted-foreground mt-1.5 sm:mt-2 max-w-lg text-sm sm:text-base">
              Our most popular medical equipment trusted by healthcare professionals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Navigation arrows - visible on larger screens */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="h-10 w-10 rounded-full border-border hover:bg-doju-lime hover:text-doju-navy hover:border-doju-lime disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="h-10 w-10 rounded-full border-border hover:bg-doju-lime hover:text-doju-navy hover:border-doju-lime disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Link to="/marketplace">
              <Button variant="doju-outline" className="gap-2 group h-10 sm:h-11 text-sm">
                View All Products
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-6">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Swipe hint for mobile */}
          <motion.div 
            className="flex sm:hidden justify-center mt-4 gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <ChevronLeft className="h-3 w-3" />
              <span>Swipe to browse</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TopSellingCarousel;
