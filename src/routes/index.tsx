import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Cart from "@/pages/Cart";
import DispatchDashboard from "@/pages/dispatch/DispatchDashboard";
import DispatchRegistration from "@/pages/dispatch/DispatchRegistration";
import Index from "@/pages/Index";
import Marketplace from "@/pages/marketplace/Marketplace";
import NotFound from "@/pages/NotFound";

import OrderTracking from "@/pages/order-tracking/OrderTracking";
import Press from "@/pages/Press";
import Privacy from "@/pages/Privacy";
import RefundPolicy from "@/pages/RefundPolicy";
import ReturnPolicy from "@/pages/ReturnPolicy";
import DisputePolicy from "@/pages/DisputePolicy";
import Terms from "@/pages/Terms";
import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth";
import ProductDetail from "@/pages/marketplace/ProductDetail";
import { sellerAppRoutes } from "./app";
import { SellerAppLayout } from "@/pages/seller/layout/app-layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";
import AdminLogin from "@/pages/admin/pages/login";
import { AdminAppLayout } from "@/pages/admin/layout/admin-app-layout";
import { adminAppRoutes } from "./admin";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLoginGuestRoute from "@/components/auth/AdminLoginGuestRoute";
import GoogleCallback from "@/pages/Auth/GoogleCallback";

const Checkout = lazy(() => import("@/pages/checkout/Checkout"));

export const allRoutes = [
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
  {
    path: "/",
    element: <Marketplace />,
  },
  {
    path: "/home",
    element: <Index />,
  },
  {
    path: "/categories",
    element: <Marketplace />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/track-order",
    element: (
      <ProtectedRoute>
        <OrderTracking />
      </ProtectedRoute>
    ),
  },

  {
    path: "/dispatch/register",
    element: <DispatchRegistration />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/careers",
    element: <Careers />,
  },
  {
    path: "/press",
    element: <Press />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/refund-policy",
    element: <RefundPolicy />,
  },
  {
    path: "/dispute-resolution",
    element: <DisputePolicy />,
  },
  {
    path: "/return-policy",
    element: <ReturnPolicy />,
  },
  {
    path: "checkout",
    element: (
      <ProtectedRoute>
        <Suspense
          fallback={
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Loading...
            </div>
          }
        >
          <Checkout />
        </Suspense>
      </ProtectedRoute>
    ),
  },

  { path: "cart", element: <Cart /> },

  {
    path: "dispatch/dashboard",
    element: <DispatchDashboard />,
  },

  {
    path: "/*",
    element: <NotFound />,
  },
  {
    path: "/",
    children: authRoutes,
  },
  {
    path: "/seller",
    element: <SellerAppLayout />,
    children: sellerAppRoutes,
  },
  {
    path: "/admin/login",
    element: (
      <AdminLoginGuestRoute>
        <AdminLogin />
      </AdminLoginGuestRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminAppLayout />
      </AdminProtectedRoute>
    ),
    children: adminAppRoutes,
  },
];

export const router = createBrowserRouter(allRoutes);
