import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oobCode) {
      toast({
        title: t('auth.resetPassword.toast.invalidLink.title'),
        description: t('auth.resetPassword.toast.invalidLink.description'),
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t('auth.resetPassword.toast.passwordMismatch.title'),
        description: t('auth.resetPassword.toast.passwordMismatch.description'),
        variant: "destructive"
      });
      return;
    }

    try {
      passwordSchema.parse(password);
    } catch (error: any) {
      toast({
        title: "Invalid password",
        description: t(`auth.resetPassword.passwordRequirements.${error.errors[0].code}`),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast({
        title: t('auth.resetPassword.toast.resetSuccess.title'),
        description: t('auth.resetPassword.toast.resetSuccess.description')
      });
      navigate('/signin');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.resetPassword.title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder={t('auth.resetPassword.newPasswordLabel')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder={t('auth.resetPassword.confirmPasswordLabel')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.resetPassword.resettingButton') : t('auth.resetPassword.resetButton')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;