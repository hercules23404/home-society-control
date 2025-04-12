
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'tenant' | 'admin' | null;
}

const RouteProtection = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Still checking auth status

    // No user, redirect to login
    if (!user) {
      if (requiredRole === 'tenant') {
        navigate('/tenant/login', { replace: true });
      } else if (requiredRole === 'admin') {
        navigate('/admin/login', { replace: true });
      }
      return;
    }

    // User exists but wrong role
    if (requiredRole && userRole !== requiredRole) {
      // Admin trying to access tenant pages
      if (userRole === 'admin' && requiredRole === 'tenant') {
        navigate('/admin/dashboard', { replace: true });
      }
      // Tenant trying to access admin pages
      else if (userRole === 'tenant' && requiredRole === 'admin') {
        navigate('/tenant/dashboard', { replace: true });
      }
    }
  }, [user, userRole, loading, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  // If we need a specific role and user doesn't have it, or no user exists, render nothing while redirect happens
  if (
    (requiredRole && !user) || 
    (requiredRole && userRole !== requiredRole)
  ) {
    return null;
  }

  return <>{children}</>;
};

export default RouteProtection;
