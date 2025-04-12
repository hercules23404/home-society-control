
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'tenant' | 'admin' | null;
}

const RouteProtection = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    console.log('RouteProtection: User role:', userRole, 'Required role:', requiredRole, 'Loading:', loading);
  }, [userRole, requiredRole, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
          <p className="text-rental-text">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // For public routes (requiredRole is null), allow access regardless of auth status
  if (requiredRole === null) {
    return <>{children}</>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    // Redirect to appropriate login page based on the required role
    const loginPath = requiredRole === 'admin' ? '/admin/login' : '/tenant/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If specific role is required but user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect tenant to tenant dashboard or admin to admin dashboard
    const redirectPath = userRole === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // User has the required role, allow access
  return <>{children}</>;
};

export default RouteProtection;
