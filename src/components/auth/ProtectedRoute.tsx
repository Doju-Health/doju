import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthRequiredPrompt from './AuthRequiredPrompt';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredPrompt />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;