import { lazy } from "react";
import { withSuspense } from "@/components/suspense/suspense";

const authRoutesConfig = [
  { path: "auth", component: () => import("@/pages/Auth/Auth") },

  {
    path: "forgot-password",
    component: () => import("@/pages/ForgotPassword"),
  },
  {
    path: "reset-password",
    component: () => import("@/pages/ResetPassword"),
  },
];

export const authRoutes = authRoutesConfig.map(({ path, component }) => {
  const LazyComponent = withSuspense(lazy(component));

  return {
    path,
    element: <LazyComponent />,
  };
});
