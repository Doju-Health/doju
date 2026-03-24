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
    path: "sellers",
    component: () => import("@/pages/admin/pages/sellers"),
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
