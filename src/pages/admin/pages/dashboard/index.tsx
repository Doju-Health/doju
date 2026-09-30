import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetAdminDashboardStats } from "../../api/use-get-dashboard-stats";
import { StatCard } from "../../components/StatCard";
import { RecentTransactionsChart } from "../../components/RecentTransactionsChart";
import {
  UserX,
  ClipboardCheck,
  PackageSearch,
  ShoppingBag,
  Users,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardStats {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    admins: number;
    pendingKyc: number;
    unverifiedKyc: number;
  };
  products: { total: number; unverified: number };
  categories: { total: number };
  transactions: { total: number; successful: number; failed: number };
}

export default function AdminDashboard() {
  const getDashboardStats = useGetAdminDashboardStats();
  const stats = getDashboardStats.data as DashboardStats | undefined;

  const unverifiedSellers = stats?.users.unverifiedKyc ?? 0;
  const pendingSellers = stats?.users.pendingKyc ?? 0;
  const pendingProducts = stats?.products.unverified ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here's a quick overview of your platform.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Platform Overview</h2>
            <p className="text-xs text-muted-foreground">
              Click any card to manage that section
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs text-muted-foreground"
            onClick={() => getDashboardStats.refetch()}
            disabled={getDashboardStats.isFetching}
          >
            <RefreshCw
              className={cn(
                "size-3.5",
                getDashboardStats.isFetching && "animate-spin",
              )}
            />
            Live data
          </Button>
        </div>

        <QueryWrapper
          currentQuery={getDashboardStats}
          customLoader={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          }
        >
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-600">
              <span className="size-1.5 rounded-full bg-red-600" />
              Requires attention
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Unverified Sellers"
                value={unverifiedSellers}
                description="Registered but KYC incomplete"
                icon={UserX}
                to="/admin/sellers?status=unverified"
                tone="danger"
                actionNeeded={unverifiedSellers > 0}
              />
              <StatCard
                title="Pending Seller Verification"
                value={pendingSellers}
                description="Documents submitted, awaiting review"
                icon={ClipboardCheck}
                to="/admin/sellers?status=pending"
                tone="warning"
                actionNeeded={pendingSellers > 0}
              />
              <StatCard
                title="Pending Products"
                value={pendingProducts}
                description="Awaiting admin approval"
                icon={PackageSearch}
                to="/admin/products"
                tone="warning"
                actionNeeded={pendingProducts > 0}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Buyers"
                value={stats?.users.buyers ?? 0}
                description="Total registered buyers"
                icon={ShoppingBag}
                to="/admin/buyers"
                tone="success"
              />
              <StatCard
                title="Total Users"
                value={stats?.users.total ?? 0}
                description={`${stats?.users.buyers ?? 0} Buyers · ${stats?.users.sellers ?? 0} Sellers · ${stats?.users.admins ?? 0} Admins`}
                icon={Users}
                to="/admin/users"
              />
            </div>
          </div>
        </QueryWrapper>
      </section>

      <RecentTransactionsChart />
    </div>
  );
}
