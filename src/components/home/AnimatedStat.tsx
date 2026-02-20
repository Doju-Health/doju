import { motion } from 'framer-motion';
import { useAnimatedCounter, parseStatValue } from '@/hooks/useAnimatedCounter';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatProps {
  value: string;
  label: string;
  icon: LucideIcon;
  index?: number;
}

const AnimatedStat = ({ value, label, icon: Icon, index = 0 }: AnimatedStatProps) => {
  const { number, suffix } = parseStatValue(value);
  const { count, ref } = useAnimatedCounter({ end: number, duration: 2000 });

  // Special case for "24/7" which isn't a number
  const isSpecialValue = value === '24/7';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-doju-lime-pale text-doju-lime mb-3"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Icon className="h-6 w-6" />
      </motion.div>
      <motion.p 
        className="text-3xl md:text-4xl font-bold text-foreground"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, type: 'spring' }}
      >
        {isSpecialValue ? value : `${count.toLocaleString()}${suffix}`}
      </motion.p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default AnimatedStat;
