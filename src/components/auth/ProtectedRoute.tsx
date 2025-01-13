import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking access', { user, role, path: location.pathname });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to signin');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    console.log('ProtectedRoute: Invalid role, redirecting to dashboard');
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};