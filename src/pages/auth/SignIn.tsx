
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/ui/language-selector';
import { AuthService } from '@/services/authService';

interface UserData {
  role?: 'worker' | 'business';
}

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const authService = new AuthService();

  useEffect(() => {
    console.log('Initializing recaptcha...');
    authService.initRecaptcha('recaptcha-container');
    
    return () => {
      console.log('Cleaning up recaptcha...');
      authService.clearRecaptcha();
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Raw phone number input:', phoneNumber);
      console.log('Attempting phone sign in...');
      
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const phoneForFirebase = `+62${cleanPhoneNumber.startsWith('0') ? cleanPhoneNumber.slice(1) : cleanPhoneNumber}`;
      
      console.log('Formatted phone number:', phoneForFirebase);
      
      const result = await authService.signInWithPhone(phoneForFirebase, password);
      console.log('Phone sign in successful, got confirmation result');
      
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
      
      toast({
        title: t('auth.otpSent'),
        description: t('auth.enterOTP'),
      });
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      toast({
        title: t('auth.error'),
        description: error.code === 'auth/invalid-phone-number'
          ? t('auth.invalidPhone')
          : error.code === 'auth/too-many-requests'
          ? t('auth.tooManyRequests')
          : error.code === 'auth/user-disabled'
          ? t('auth.userDisabled')
          : error.code === 'auth/operation-not-allowed'
          ? t('auth.operationNotAllowed')
          : t('auth.error'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Verifying OTP...');
      const userData = await authService.verifySignInOTP(confirmationResult, verificationCode) as UserData;
      console.log('OTP verification successful:', userData);
      
      if (!userData) {
        throw new Error('No user data returned');
      }

      if (userData.role === 'worker') {
        navigate('/worker/dashboard');
      } else if (userData.role === 'business') {
        navigate('/business/dashboard');
      } else {
        console.error('Invalid user role:', userData.role);
        toast({
          title: t('auth.error'),
          description: t('auth.invalidRole'),
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: t('auth.error'),
        description: error.code === 'auth/invalid-verification-code'
          ? t('auth.invalidOTP')
          : error.code === 'auth/code-expired'
          ? t('auth.otpExpired')
          : t('auth.error'),
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

  const renderPhoneForm = () => (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
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
      <div id="recaptcha-container"></div>
    </form>
  );

  const renderOTPForm = () => (
    <form onSubmit={handleOTPSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder={t('auth.enterOTP')}
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        disabled={isLoading}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('auth.verifying') : t('auth.verify')}
      </Button>
    </form>
  );

  return (
    <AuthLayout title={t('auth.signIn')}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      {step === 'phone' ? renderPhoneForm() : renderOTPForm()}
      <div className="flex flex-col gap-2 text-center text-sm mt-4">
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
    </AuthLayout>
  );
};

export default SignIn;
