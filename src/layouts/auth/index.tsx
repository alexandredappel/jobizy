import { Outlet, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const AuthLayoutWrapper = () => {
  const location = useLocation();
  
  // Define titles for each auth route
  const getTitleForRoute = (pathname: string) => {
    switch (pathname) {
      case '/signin':
        return 'Sign In to Your Account';
      case '/signup':
        return 'Create your Jobizy Account';
      case '/forgot-password':
        return 'Reset Password';
      case '/reset-password':
        return 'Set New Password';
      default:
        return 'Authentication';
    }
  };

  return (
    <AuthLayout title={getTitleForRoute(location.pathname)}>
      <Outlet />
    </AuthLayout>
  );
};

export default AuthLayoutWrapper;