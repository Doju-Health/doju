import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardTone = "danger" | "warning" | "success" | "neutral";

const TONE_STYLES: Record<StatCardTone, { icon: string; badge: string }> = {
  danger: {
    icon: "bg-red-100 text-red-600",
    badge: "bg-red-100 text-red-600",
  },
  warning: {
    icon: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
  success: {
    icon: "bg-green-100 text-green-700",
    badge: "bg-green-100 text-green-700",
  },
  neutral: {
    icon: "bg-muted text-foreground",
    badge: "bg-muted text-muted-foreground",
  },
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  to: string;
  tone?: StatCardTone;
  /** Shows the "Action needed" badge. */
  actionNeeded?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  to,
  tone = "neutral",
  actionNeeded = false,
}: StatCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-doju-lime/50"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            styles.icon,
          )}
        >
          <Icon className="size-5" />
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          View All
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {actionNeeded && (
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              styles.badge,
            )}
          >
            Action needed
          </span>
        )}
      </div>
    </Link>
  );
}
