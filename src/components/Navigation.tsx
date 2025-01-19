import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AuthService } from '@/services/authService';
import { Home, UserIcon, Search, LogOut } from 'lucide-react';
import type { User } from '@/types/database.types';

interface NavigationLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavigationLink = ({ to, label, icon }: NavigationLinkProps) => (
  <Link 
    to={to} 
    className="text-secondary hover:text-primary flex items-center gap-2 transition-colors duration-200"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const authService = new AuthService();

  // Hide navigation on auth pages
  const isAuthPage = ['/signin', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);
  if (isAuthPage) return null;

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/signin');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getProfileLink = () => {
    if (!user) return '/profile';
    return user.role === 'worker' ? '/worker/profile/edit' : '/business/profile/edit';
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'worker' ? '/worker/dashboard' : '/business/dashboard';
  };

  return (
    <>
      {/* Logo - always visible */}
      <div className="fixed top-4 left-4 lg:right-8 lg:left-auto z-50">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Jobizy</span>
        </Link>
      </div>

      {/* Desktop menu - vertical left */}
      <nav className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:bg-white lg:shadow-md lg:py-20 lg:px-6">
        <div className="flex flex-col space-y-6">
          {user ? (
            <>
              <NavigationLink 
                to={getDashboardLink()} 
                icon={<Home className="w-4 h-4" />}
                label="Dashboard"
              />
              
              {user.role === 'business' && (
                <NavigationLink 
                  to="/business/search" 
                  icon={<Search className="w-4 h-4" />}
                  label="Search"
                />
              )}
              
              <NavigationLink 
                to={getProfileLink()} 
                icon={<UserIcon className="w-4 h-4" />}
                label="Profile"
              />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-secondary hover:text-primary flex items-center gap-2 justify-start p-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <NavigationLink 
                to="/signin" 
                label="Sign In"
              />
              <NavigationLink 
                to="/signup" 
                label="Sign Up"
              />
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu - horizontal bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 px-6">
        <div className="flex justify-around items-center">
          {user ? (
            <>
              <NavigationLink 
                to={getDashboardLink()} 
                icon={<Home className="w-4 h-4" />}
                label=""
              />
              
              {user.role === 'business' && (
                <NavigationLink 
                  to="/business/search" 
                  icon={<Search className="w-4 h-4" />}
                  label=""
                />
              )}
              
              <NavigationLink 
                to={getProfileLink()} 
                icon={<UserIcon className="w-4 h-4" />}
                label=""
              />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-secondary hover:text-primary"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <NavigationLink 
                to="/signin" 
                label="Sign In"
              />
              <NavigationLink 
                to="/signup" 
                label="Sign Up"
              />
            </>
          )}
        </div>
      </nav>
    </>
  );
};