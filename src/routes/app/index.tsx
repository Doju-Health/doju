import { lazy } from "react";
import { withSuspense } from "@/components/suspense/suspense";

const appRoutesConfig = [
  {
    path: "/seller-dashboard",
    component: () => import("@/pages/seller/SellerDashboard"),
  },
];

export const appRoutes = appRoutesConfig.map(({ path, component }) => {
  const LazyComponent = withSuspense(lazy(component));

  return {
    path,
    element: <LazyComponent />,
  };
});
