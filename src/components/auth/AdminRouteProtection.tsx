
import { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRouteProtection = ({ children }: AdminRouteProps) => {
  // For testing: simply return children with no restrictions
  return <>{children}</>;
};

export default AdminRouteProtection;
