
import { ReactNode, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRouteProtection = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Render nothing while redirect happens
  }

  return <>{children}</>;
};

export default AdminRouteProtection;
