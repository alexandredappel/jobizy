import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
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
import { Home, MessageCircle, User, Search, LogOut } from 'lucide-react';
import { User } from '@/types/database.types';

export const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const authService = new AuthService();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Jobizy</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-secondary hover:text-primary flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/messages" 
                  className="text-secondary hover:text-primary flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                </Link>
                
                {user.role === 'business' && (
                  <Link 
                    to="/business/search" 
                    className="text-secondary hover:text-primary flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Link>
                )}
                
                <Link 
                  to={getProfileLink()} 
                  className="text-secondary hover:text-primary flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-secondary hover:text-primary flex items-center gap-2"
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
                <Link 
                  to="/signin" 
                  className="text-secondary hover:text-primary flex items-center gap-2"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="text-secondary hover:text-primary flex items-center gap-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};