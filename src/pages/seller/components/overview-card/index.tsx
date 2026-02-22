import { motion } from "framer-motion";

export const OverviewCard = ({ stat, index }: { stat: any; index: number }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-border bg-card p-4 lg:p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center`}
        >
          <stat.icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-foreground">
        {stat.value}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
};
