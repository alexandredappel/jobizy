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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validation du mot de passe
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast({
          title: t('auth.signUp.error.title'),
          description: t('auth.signUp.error.passwordRequirements'),
          variant: "destructive"
        });
        return;
      }

      console.log('Initializing phone signup with role:', role);
      
      authService.initRecaptcha('recaptcha-container');
      
      // Format du numéro de téléphone
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, ''); // Enlève tout sauf les chiffres
      const phoneForFirebase = `+62${cleanPhoneNumber.startsWith('0') ? cleanPhoneNumber.slice(1) : cleanPhoneNumber}`;
      const phoneForStorage = cleanPhoneNumber.startsWith('0') ? cleanPhoneNumber : `0${cleanPhoneNumber}`;

      const result = await authService.signUpWithPhone(
        phoneForFirebase, // Pour l'authentification Firebase
        password,
        role,
        {
          phoneNumber: phoneForStorage, // Pour le stockage dans la base de données
          preferred_language: i18n.language || navigator.language.split('-')[0] || 'en',
        }
      );
      
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
      toast({
        title: t('auth.signUp.otpSent.title'),
        description: t('auth.signUp.otpSent.description'),
      });
    } catch (error: any) {
      console.error('Phone signup error:', error);
      const errorMessage = error.code === 'PHONE_ALREADY_EXISTS'
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
      authService.clearRecaptcha();
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!confirmationResult) {
        throw new Error('No confirmation result found');
      }

      const user = await authService.verifyOTP(confirmationResult, verificationCode);
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
      authService.clearRecaptcha();
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Enlève tout sauf les chiffres
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
          required
        />
      </div>
      <Input
        type="password"
        placeholder={t('auth.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <div className="flex gap-4">
        <Button
          type="button"
          variant={role === 'worker' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('worker')}
        >
          {t('auth.signUp.roleButtons.worker')}
        </Button>
        <Button
          type="button"
          variant={role === 'business' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('business')}
        >
          {t('auth.signUp.roleButtons.business')}
        </Button>
      </div>
      <Button type="submit" className="w-full">
        {t('auth.signUp.submitButton')}
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
        required
      />
      <Button type="submit" className="w-full">
        {t('auth.signUp.verifyButton')}
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
