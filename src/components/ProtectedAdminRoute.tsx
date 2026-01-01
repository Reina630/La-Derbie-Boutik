import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface ProtectedAdminRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

const ProtectedAdminRoute = ({ children, requireSuperAdmin = false }: ProtectedAdminRouteProps) => {
  const { isAuthenticated, isSuperAdmin } = useAdminAuth();
  console.log('ProtectedAdminRoute: isAuthenticated=', isAuthenticated, 'isSuperAdmin=', isSuperAdmin, 'requireSuperAdmin=', requireSuperAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
