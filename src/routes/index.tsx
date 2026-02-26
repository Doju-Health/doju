import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import DispatchDashboard from "@/pages/dispatch/DispatchDashboard";
import DispatchRegistration from "@/pages/dispatch/DispatchRegistration";
import Index from "@/pages/Index";
import Marketplace from "@/pages/marketplace/Marketplace";
import NotFound from "@/pages/NotFound";

import OrderTracking from "@/pages/OrderTracking";
import Press from "@/pages/Press";
import Privacy from "@/pages/Privacy";
import ReturnPolicy from "@/pages/ReturnPolicy";
import Terms from "@/pages/Terms";
import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth";
import ProductDetail from "@/pages/marketplace/ProductDetail";
import { sellerAppRoutes } from "./app";
import { SellerAppLayout } from "@/pages/seller/layout/app-layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export const allRoutes = [
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
    element: <OrderTracking />,
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
    path: "/return-policy",
    element: <ReturnPolicy />,
  },

  {
    path: "checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
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
];

export const router = createBrowserRouter(allRoutes);
