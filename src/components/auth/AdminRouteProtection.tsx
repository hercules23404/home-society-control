
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
    // Check if we're on the create-society page and coming from signup
    const isCreateSocietyPage = location.pathname === '/admin/create-society';
    const hasSignupState = location.state && (location.state as any).userId;
    
    // Only show error toast when not in the create-society flow
    if (!loading && !user && !isCreateSocietyPage) {
      toast.error('Please sign in to access this page');
    } else if (!loading && user && !isAdmin && !isCreateSocietyPage && !hasSignupState) {
      toast.error('You do not have admin privileges');
    }
  }, [loading, user, isAdmin, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rental-primary"></div>
      </div>
    );
  }

  // Special case for the create-society page during signup flow
  if (location.pathname === '/admin/create-society' && location.state && (location.state as any).userId) {
    return <>{children}</>;
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
