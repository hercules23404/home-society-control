
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRouteProtection = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { user, isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    // Show error toast only once when redirecting from protected route
    if (!loading && !user) {
      toast.error('Please sign in to access this page');
    } else if (!loading && user && !isAdmin) {
      toast.error('You do not have admin privileges');
    }
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rental-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRouteProtection;
