
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const authService = new AuthService();

  // Hide navigation on auth pages and worker onboarding
  const isHiddenPage = [
    '/signin', 
    '/signup', 
    '/forgot-password', 
    '/reset-password',
    '/worker/onboarding',
    '/'
  ].includes(location.pathname);
  
  if (isHiddenPage) return null;

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast({
        title: t('common.toast.success'),
        description: t('auth.signOut.success'),
      });
      navigate('/signin');
    } catch (error: any) {
      toast({
        title: t('common.toast.error'),
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
      {/* Desktop menu - vertical left */}
      <nav className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:bg-white lg:shadow-md lg:py-6">
        {/* Logo - desktop */}
        <Link to="/" className="px-6 mb-8">
          <span className="text-2xl font-bold text-primary">Jobizy</span>
        </Link>

        <div className="px-6 flex flex-col h-full">
          {/* Main navigation links */}
          <div className="flex-1 flex flex-col space-y-6">
            {user ? (
              <>
                <NavigationLink 
                  to={getDashboardLink()} 
                  icon={<Home className="w-4 h-4" />}
                  label={t('common.navigation.dashboard')}
                />
                
                {user.role === 'business' && (
                  <NavigationLink 
                    to="/business/search" 
                    icon={<Search className="w-4 h-4" />}
                    label={t('common.navigation.search')}
                  />
                )}
                
                <NavigationLink 
                  to={getProfileLink()} 
                  icon={<UserIcon className="w-4 h-4" />}
                  label={t('common.navigation.profile')}
                />
              </>
            ) : (
              <>
                <NavigationLink 
                  to="/signin" 
                  label={t('auth.signIn')}
                />
                <NavigationLink 
                  to="/signup" 
                  label={t('auth.signUp.title')}
                />
              </>
            )}
          </div>

          {/* Logout button at the bottom */}
          {user && (
            <div className="mt-auto pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-secondary hover:text-primary flex items-center gap-2 justify-start p-0 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('common.navigation.logout')}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('common.navigation.logoutConfirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('common.navigation.logoutDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.navigation.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>{t('common.navigation.logout')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu - horizontal bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 px-6 z-50">
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
                    <AlertDialogTitle>{t('common.navigation.logoutConfirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('common.navigation.logoutDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.navigation.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>{t('common.navigation.logout')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <NavigationLink 
                to="/signin" 
                label={t('auth.signIn')}
              />
              <NavigationLink 
                to="/signup" 
                label={t('auth.signUp.title')}
              />
            </>
          )}
        </div>
      </nav>

      {/* Logo - mobile */}
      <div className="lg:hidden fixed top-4 left-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Jobizy</span>
        </Link>
      </div>
    </>
  );
};
