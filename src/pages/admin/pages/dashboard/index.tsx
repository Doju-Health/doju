import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetAdminDashboardStats } from "../../api/use-get-dashboard-stats";
import { StatCard } from "../../components/StatCard";
import {
  Users,
  ShoppingBag,
  LayoutGrid,
  CreditCard,
  CheckCircle2,
  XCircle,
  Store,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  users: { total: number; buyers: number; sellers: number };
  products: { total: number };
  categories: { total: number };
  transactions: { total: number; successful: number; failed: number };
}

export default function AdminDashboard() {
  const getDashboardStats = useGetAdminDashboardStats();
  const stats = getDashboardStats.data as DashboardStats | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
      </div>

      <QueryWrapper
        currentQuery={getDashboardStats}
        customLoader={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-40 w-full rounded-md" />
            ))}
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.users.total ?? 0}
            icon={Users}
            sub={[
              {
                label: "Buyers",
                value: stats?.users.buyers ?? 0,
                icon: Users,
                color: "text-blue-500",
              },
              {
                label: "Sellers",
                value: stats?.users.sellers ?? 0,
                icon: Store,
                color: "text-green-500",
              },
            ]}
          />
          <StatCard
            title="Total Products"
            value={stats?.products.total ?? 0}
            icon={ShoppingBag}
          />
          <StatCard
            title="Categories"
            value={stats?.categories.total ?? 0}
            icon={LayoutGrid}
          />
          <StatCard
            title="Transactions"
            value={stats?.transactions.total ?? 0}
            icon={CreditCard}
            sub={[
              {
                label: "Successful",
                value: stats?.transactions.successful ?? 0,
                icon: CheckCircle2,
                color: "text-green-500",
              },
              {
                label: "Failed",
                value: stats?.transactions.failed ?? 0,
                icon: XCircle,
                color: "text-red-500",
              },
            ]}
          />
        </div>
      </QueryWrapper>
    </div>
  );
}
