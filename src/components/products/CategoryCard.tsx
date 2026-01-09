import { Category } from '@/types';
import { Link } from 'react-router-dom';
import { Stethoscope, Activity, Package, Thermometer, Wind, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope: Stethoscope,
  Activity: Activity,
  Package: Package,
  Thermometer: Thermometer,
  Wind: Wind,
  Wheelchair: Heart, // Using Heart as fallback
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || Package;

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:border-doju-lime/30">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-doju-lime-pale text-doju-lime">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-doju-navy">{category.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
        </div>
      </div>
      
      {/* Placeholder image */}
      <div className="relative aspect-[4/3] rounded-lg bg-muted overflow-hidden mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-doju-navy/5 to-doju-lime/5" />
      </div>

      <div className="flex gap-2">
        <Link to={`/marketplace?category=${category.id}`}>
          <Button variant="doju-ghost" size="sm">
            View items
          </Button>
        </Link>
        <Link to={`/marketplace?category=${category.id}`}>
          <Button variant="doju-primary" size="sm">
            Shop now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
