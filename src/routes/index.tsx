import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import DispatchDashboard from "@/pages/dispatch/DispatchDashboard";
import DispatchRegistration from "@/pages/dispatch/DispatchRegistration";
import Index from "@/pages/Index";
import Marketplace from "@/pages/Marketplace";
import NotFound from "@/pages/NotFound";
import BuyerOnboarding from "@/pages/onboarding/BuyerOnboarding";
import SellerOnboarding from "@/pages/onboarding/SellerOnboarding";
import OrderTracking from "@/pages/OrderTracking";
import Press from "@/pages/Press";
import Privacy from "@/pages/Privacy";
import ReturnPolicy from "@/pages/ReturnPolicy";
import SellerDashboard from "@/pages/seller/SellerDashboard";
import Terms from "@/pages/Terms";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth";
import ProductDetail from "@/pages/ProductDetail";
export const allRoutes = [
  {
    path: "/",
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
    path: "/onboarding/buyer",
    element: <BuyerOnboarding />,
  },
  {
    path: "/onboarding/seller",
    element: <SellerOnboarding />,
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

  { path: "checkout", element: <Checkout /> },

  { path: "carts", element: <Cart /> },
  {
    path: "seller/dashboard",
    element: <SellerDashboard />,
  },
  {
    path: "dispatch/dashboard",
    element: <DispatchDashboard />,
  },

  {
    path: "/*",
    element: <NotFound />,
  },
  {
    path:'/',
    children: authRoutes
  }
];

export const router = createBrowserRouter(allRoutes);
