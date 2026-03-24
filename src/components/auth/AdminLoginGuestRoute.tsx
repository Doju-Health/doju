import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface AdminLoginGuestRouteProps {
  children: ReactNode;
}

const AdminLoginGuestRoute = ({ children }: AdminLoginGuestRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.authData);

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminLoginGuestRoute;
