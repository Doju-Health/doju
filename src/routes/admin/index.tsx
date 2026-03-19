import { lazy } from "react";
import { withSuspense } from "@/components/suspense/suspense";

const adminAppRoutesConfig = [
  {
    path: "dashboard",
    component: () => import("@/pages/admin/pages/dashboard"),
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
