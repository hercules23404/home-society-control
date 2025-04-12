
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'tenant' | 'admin' | null;
}

const RouteProtection = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Here you would typically check with Supabase for authentication status
    // For now, we'll use localStorage as a placeholder
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // You could add a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // For public routes (requiredRole is null), allow access regardless of auth status
  if (requiredRole === null) {
    return <>{children}</>;
  }

  // If user is not logged in, redirect to login
  if (!userRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If specific role is required but user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect tenant to tenant dashboard or admin to admin dashboard
    return <Navigate to={userRole === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard'} replace />;
  }

  // User has the required role, allow access
  return <>{children}</>;
};

export default RouteProtection;
