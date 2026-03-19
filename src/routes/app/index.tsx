import { lazy } from "react";
import { withSuspense } from "@/components/suspense/suspense";

const sellerAppRoutesConfig = [
  {
    path: "overview",
    component: () => import("@/pages/seller/pages/overview"),
  },
  {
    path: "products",
    component: () => import("@/pages/seller/pages/products"),
  },
  {
    path: "products/:id",
    component: () => import("@/pages/seller/pages/products/ProductDetails"),
  },
  {
    path: "orders",
    component: () => import("@/pages/seller/pages/orders"),
  },
  {
    path: "categories",
    component: () => import("@/pages/seller/pages/categories"),
  },
];

export const sellerAppRoutes = sellerAppRoutesConfig.map(
  ({ path, component }) => {
    const LazyComponent = withSuspense(lazy(component));

    return {
      path,
      element: <LazyComponent />,
    };
  },
);
