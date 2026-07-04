import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface SuperAdminProtectedRouteProps {
  children: ReactNode;
}

const SuperAdminProtectedRoute = ({
  children,
}: SuperAdminProtectedRouteProps) => {
  const { user } = useAppSelector((state) => state.authData);

  if (user?.role !== "super_admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminProtectedRoute;
