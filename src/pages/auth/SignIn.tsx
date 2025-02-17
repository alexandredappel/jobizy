import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { useTranslation } from 'react-i18next';
import { AuthService } from '@/services/authService';

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const authService = new AuthService();

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
      
      authService.initRecaptcha('recaptcha-container');
      
      // Format du numéro de téléphone
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const phoneForFirebase = `+62${cleanPhoneNumber.startsWith('0') ? cleanPhoneNumber.slice(1) : cleanPhoneNumber}`;

      const result = await authService.signInWithPhone(phoneForFirebase, '');
      
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
      toast({
        title: t('auth.signIn.otpSent.title'),
        description: t('auth.signIn.otpSent.description'),
      });
    } catch (error: any) {
      console.error('Phone signin error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        setRetryTimeout(60); // 60 secondes de délai
      }
      
      const errorMessage = 
        error.code === 'auth/too-many-requests'
          ? t('auth.signIn.error.tooManyRequests')
        : error.code === 'auth/invalid-phone-number'
          ? t('auth.signIn.error.invalidPhone')
        : error.code === 'RECAPTCHA_NOT_INITIALIZED'
          ? t('auth.recaptchaError')
        : error.message;

      toast({
        title: t('auth.signIn.error.title'),
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

      const user = await authService.verifySignInOTP(confirmationResult, verificationCode);
      
      // Redirection basée sur le rôle de l'utilisateur
      const redirectPath = `/${user.role}/dashboard`;
      navigate(redirectPath);
      
      toast({
        title: t('auth.signIn.success.title'),
        description: t('auth.signIn.success.description'),
      });
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: t('auth.signIn.error.title'),
        description: error.message === 'INVALID_VERIFICATION_CODE'
          ? t('auth.signIn.error.invalidOTP')
          : error.message,
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
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || retryTimeout > 0}
      >
        {retryTimeout > 0 
          ? t('auth.signIn.retryIn', { seconds: retryTimeout })
          : isLoading 
            ? t('auth.signIn.loading')
            : t('auth.signIn.submitButton')}
      </Button>
      <div id="recaptcha-container"></div>
    </form>
  );

  const renderOTPForm = () => (
    <form className="space-y-4" onSubmit={handleOTPVerification}>
      <Input
        type="text"
        placeholder={t('auth.signIn.otpPlaceholder')}
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
        {isLoading ? t('auth.signIn.verifying') : t('auth.signIn.verifyButton')}
      </Button>
    </form>
  );

  return (
    <AuthLayout title={t('auth.signIn.title')}>
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('auth.signIn.welcome')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.signIn.enterCredentials')}
        </p>
      </div>

      {step === 'phone' ? renderPhoneForm() : renderOTPForm()}

      <div className="text-center text-sm text-secondary mt-4">
        {t('auth.signIn.noAccount')}{' '}
        <Link to="/signup" className="text-primary hover:text-primary/80">
          {t('auth.signUp')}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
