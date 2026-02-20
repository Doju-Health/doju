import { Category } from '@/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <Link to={`/marketplace?category=${category.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative rounded-2xl overflow-hidden cursor-pointer h-56 sm:h-64"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {category.image ? (
            <motion.img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover object-center"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-doju-navy to-doju-navy-light" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-doju-navy via-doju-navy/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.08 }}
          >
            <h3 className="text-xl font-bold text-primary-foreground mb-1 group-hover:text-doju-lime transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-primary-foreground/70 mb-3">
              {category.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary-foreground/60">
                {category.productCount} products
              </span>
              <motion.div
                className="flex items-center gap-1 text-doju-lime text-sm font-medium"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                Shop now
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-doju-lime opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
