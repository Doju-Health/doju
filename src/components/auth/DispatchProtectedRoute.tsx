import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DispatchProtectedRouteProps {
  children: ReactNode;
}

const DispatchProtectedRoute = ({ children }: DispatchProtectedRouteProps) => {
  const { user, loading, isDispatch, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to dispatch registration
        navigate('/dispatch/register');
      } else if (!isDispatch && !isAdmin) {
        // Logged in but not a dispatch agent or admin
        navigate('/');
      }
    }
  }, [user, loading, isDispatch, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  if (!user || (!isDispatch && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default DispatchProtectedRoute;
