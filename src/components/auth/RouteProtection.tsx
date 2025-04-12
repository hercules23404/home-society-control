
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'tenant' | 'admin' | null;
}

const RouteProtection = ({ children }: ProtectedRouteProps) => {
  // For testing: simply return children with no restrictions
  return <>{children}</>;
};

export default RouteProtection;
