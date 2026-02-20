import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SellerProtectedRouteProps {
  children: ReactNode;
}

const SellerProtectedRoute = ({ children }: SellerProtectedRouteProps) => {
  const { user, loading, isSeller, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to seller onboarding
        navigate('/seller-onboarding');
      } else if (!isSeller && !isAdmin) {
        // Logged in but not a seller or admin
        navigate('/');
      }
    }
  }, [user, loading, isSeller, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  if (!user || (!isSeller && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default SellerProtectedRoute;
