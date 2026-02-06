import { lazy } from "react";
import { withSuspense } from "@/components/suspense/suspense";

const authRoutesConfig = [
  { path: "login", component: () => import("@/pages/Login") },
  { path: "auth", component: () => import("@/pages/Auth") },

  {
    path: "forgot-password",
    component: () => import("@/pages/ForgotPassword"),
  },
];

export const authRoutes = authRoutesConfig.map(({ path, component }) => {
  const LazyComponent = withSuspense(lazy(component));

  return {
    path,
    element: <LazyComponent />,
  };
});
