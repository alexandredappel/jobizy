
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/ui/language-selector';
import { AuthService } from '@/services/authService';

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const authService = new AuthService();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting to sign in with phone:', phoneNumber);
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const userData = await authService.signInWithPhone(formattedPhone, password);
      
      if (!userData) {
        throw new Error('No user data returned from sign in');
      }

      console.log('Sign in successful:', userData);
      
      if (userData.role === 'worker' || userData.role === 'business') {
        if (userData.role === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/business/dashboard');
        }
      } else {
        console.error('Invalid user role:', userData.role);
        toast({
          title: t('auth.error'),
          description: t('auth.invalidRole'),
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = error.message === 'User not found' 
        ? t('auth.userNotFound')
        : error.message === 'Invalid password'
          ? t('auth.invalidPassword')
          : t('auth.error');
      
      toast({
        title: t('auth.signInError'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.signIn')}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          type="tel"
          placeholder={t('auth.phone')}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.signIn.loading') : t('auth.signIn')}
        </Button>
        <div className="flex flex-col gap-2 text-center text-sm">
          <Link 
            to="/forgot-password"
            className="text-primary hover:text-primary/80"
          >
            {t('auth.forgotPassword.link')}
          </Link>
          <span className="text-secondary">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80">
              {t('auth.signUp.title')}
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
