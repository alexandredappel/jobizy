
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
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const authService = new AuthService();

  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        await authService.initRecaptcha('recaptcha-container');
        setIsRecaptchaReady(true);
      } catch (error) {
        console.error('Failed to initialize reCAPTCHA:', error);
        setIsRecaptchaReady(false);
        toast({
          title: t('auth.error'),
          description: t('auth.recaptchaError'),
          variant: "destructive"
        });
      }
    };

    initializeRecaptcha();
    
    return () => {
      authService.clearRecaptcha();
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRecaptchaReady) {
      toast({
        title: t('auth.error'),
        description: t('auth.recaptchaNotReady'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const phoneForFirebase = `+62${cleanPhoneNumber.startsWith('0') ? cleanPhoneNumber.slice(1) : cleanPhoneNumber}`;
      
      console.log('Verifying phone number:', phoneForFirebase);
      
      const result = await authService.verifyPhoneNumber(phoneForFirebase);
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
      
      toast({
        title: t('auth.otpSent'),
        description: t('auth.enterOTP'),
      });
    } catch (error: any) {
      const errorMessage = 
        error.message === 'USER_NOT_FOUND' ? t('auth.userNotFound') :
        error.message === 'TOO_MANY_REQUESTS' ? t('auth.tooManyRequests') :
        error.message === 'INVALID_PHONE_NUMBER' ? t('auth.invalidPhone') :
        error.message === 'RECAPTCHA_NOT_INITIALIZED' ? t('auth.recaptchaError') :
        t('auth.error');

      toast({
        title: t('auth.error'),
        description: errorMessage,
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
      const userData = await authService.verifyOTP(confirmationResult, verificationCode) as UserData;
      
      if (!userData) {
        throw new Error('No user data returned');
      }

      if (userData.role === 'worker') {
        navigate('/worker/dashboard');
      } else if (userData.role === 'business') {
        navigate('/business/dashboard');
      } else {
        throw new Error('INVALID_ROLE');
      }
    } catch (error: any) {
      const errorMessage = 
        error.message === 'INVALID_OTP' ? t('auth.invalidOTP') :
        error.message === 'OTP_EXPIRED' ? t('auth.otpExpired') :
        error.message === 'INVALID_ROLE' ? t('auth.invalidRole') :
        t('auth.error');

      toast({
        title: t('auth.error'),
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
          disabled={isLoading || !isRecaptchaReady}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !isRecaptchaReady}
      >
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
