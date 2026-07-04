import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.authData);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
