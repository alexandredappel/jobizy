import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const emailSchema = z.string().email('Please enter a valid email address');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      toast({
        title: t('auth.forgotPassword.toast.invalidEmail.title'),
        description: t('auth.forgotPassword.toast.invalidEmail.description'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: t('auth.forgotPassword.toast.resetSent.title'),
        description: t('auth.forgotPassword.toast.resetSent.description')
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
    <AuthLayout title={t('auth.forgotPassword.title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder={t('auth.forgotPassword.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.forgotPassword.sendingButton') : t('auth.forgotPassword.sendButton')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/signin')}
          disabled={isLoading}
        >
          {t('auth.forgotPassword.backToSignIn')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;