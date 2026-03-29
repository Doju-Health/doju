import { lazy } from "react";
import { withSuspense } from "@/components/suspense/suspense";

const adminAppRoutesConfig = [
  {
    path: "dashboard",
    component: () => import("@/pages/admin/pages/dashboard"),
  },
  {
    path: "users",
    component: () => import("@/pages/admin/pages/users"),
  },
  {
    path: "users/:id",
    component: () => import("@/pages/admin/pages/users/users-details"),
  },
  {
    path: "sellers",
    component: () => import("@/pages/admin/pages/sellers"),
  },
  {
    path: "buyers",
    component: () => import("@/pages/admin/pages/buyers"),
  },
  {
    path: "products",
    component: () => import("@/pages/admin/pages/products"),
  },
  {
    path: "transactions",
    component: () => import("@/pages/admin/pages/transactions"),
  },
  {
    path: "transactions/:id",
    component: () =>
      import("@/pages/admin/pages/transactions/transaction-details.tsx"),
  },
];

export const adminAppRoutes = adminAppRoutesConfig.map(
  ({ path, component }) => {
    const LazyComponent = withSuspense(lazy(component));

    return {
      path,
      element: <LazyComponent />,
    };
  },
);
