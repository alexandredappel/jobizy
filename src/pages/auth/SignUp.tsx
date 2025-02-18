import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { UserRole } from '@/types/firebase.types';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/ui/language-selector';
import { AuthService } from '@/services/authService';

const SignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const authService = new AuthService();

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = ['en', 'id'].includes(browserLang) ? browserLang : 'en';
    console.log('Setting language based on browser:', defaultLang);
    i18n.changeLanguage(defaultLang);
    return () => {
      authService.clearRecaptcha();
    };
  }, []);

  useEffect(() => {
    if (retryTimeout > 0) {
      const timer = setTimeout(() => {
        setRetryTimeout(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryTimeout]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      console.log('Initializing phone signup with role:', role);
      
      authService.initRecaptcha('recaptcha-container');
      
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const phoneForFirebase = `+62${cleanPhoneNumber.startsWith('0') ? cleanPhoneNumber.slice(1) : cleanPhoneNumber}`;
      
      const result = await authService.verifyPhoneNumber(phoneForFirebase);
      
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
      toast({
        title: t('auth.signUp.otpSent.title'),
        description: t('auth.signUp.otpSent.description'),
      });
    } catch (error: any) {
      console.error('Phone signup error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        setRetryTimeout(60);
      }
      
      const errorMessage = 
        error.code === 'auth/too-many-requests'
          ? t('auth.signUp.error.tooManyRequests')
        : error.code === 'auth/invalid-phone-number'
          ? t('auth.signUp.error.invalidPhone')
        : error.code === 'PHONE_ALREADY_EXISTS'
          ? t('auth.signUp.error.phoneExists')
        : error.code === 'RECAPTCHA_NOT_INITIALIZED'
          ? t('auth.recaptchaError')
        : error.message;

      toast({
        title: t('auth.signUp.error.title'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      authService.clearRecaptcha();
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!confirmationResult) {
        throw new Error('No confirmation result found');
      }

      const user = await authService.verifyOTP(confirmationResult, verificationCode, true);
      console.log('User created successfully, navigating to onboarding');
      navigate(`/${user.role}/onboarding`);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: t('auth.signUp.error.title'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      authService.clearRecaptcha();
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
    <form className="space-y-4" onSubmit={handlePhoneSubmit}>
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
          disabled={isLoading || retryTimeout > 0}
          required
        />
      </div>
      <Input
        type="password"
        placeholder={t('auth.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading || retryTimeout > 0}
        required
        minLength={8}
      />
      <div className="flex gap-4">
        <Button
          type="button"
          variant={role === 'worker' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('worker')}
          disabled={isLoading || retryTimeout > 0}
        >
          {t('auth.signUp.roleButtons.worker')}
        </Button>
        <Button
          type="button"
          variant={role === 'business' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('business')}
          disabled={isLoading || retryTimeout > 0}
        >
          {t('auth.signUp.roleButtons.business')}
        </Button>
      </div>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || retryTimeout > 0}
      >
        {retryTimeout > 0 
          ? t('auth.signUp.retryIn', { seconds: retryTimeout })
          : isLoading 
            ? t('auth.signUp.loading')
            : t('auth.signUp.submitButton')}
      </Button>
      <div id="recaptcha-container"></div>
    </form>
  );

  const renderOTPForm = () => (
    <form className="space-y-4" onSubmit={handleOTPVerification}>
      <Input
        type="text"
        placeholder={t('auth.signUp.otpPlaceholder')}
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        disabled={isLoading}
        required
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t('auth.signUp.verifying') : t('auth.signUp.verifyButton')}
      </Button>
    </form>
  );

  return (
    <AuthLayout title={t('auth.signUp.title')}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      {step === 'phone' ? renderPhoneForm() : renderOTPForm()}
      <div className="text-center text-sm text-secondary mt-4">
        {t('auth.signUp.alreadyHaveAccount')}{' '}
        <Link to="/signin" className="text-primary hover:text-primary/80">
          {t('auth.signIn')}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
