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
      
      const userData = await authService.signInWithPhone(phoneNumber, password);
      
      console.log('Sign in successful:', userData);
      
      if (userData && userData.role === 'worker' || userData.role === 'business') {
        if (userData.role === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/business/dashboard');
        }
      } else {
        console.error('Invalid user role:', userData?.role);
        toast({
          title: t('auth.error'),
          description: t('auth.invalidRole'),
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = error.message === 'USER_NOT_FOUND'
        ? t('auth.userNotFound')
        : error.message === 'INVALID_PASSWORD'
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

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value.startsWith('0')) {
      value = '0' + value;
    }
    setPhoneNumber(value);
  };

  return (
    <AuthLayout title={t('auth.signIn')}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            +62
          </span>
          <Input
            type="tel"
            placeholder="082266255603"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="pl-12"
            disabled={isLoading}
            required
          />
        </div>
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
