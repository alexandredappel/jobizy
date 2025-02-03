import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { UserRole } from '@/types/firebase.types';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/ui/language-selector';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  // Detect browser language on first load
  useEffect(() => {
    // Get browser language (will return something like 'en-US' or 'id-ID')
    const browserLang = navigator.language.split('-')[0];
    // Check if browser language is supported, default to 'en' if not
    const defaultLang = ['en', 'id'].includes(browserLang) ? browserLang : 'en';
    console.log('Setting language based on browser:', defaultLang);
    i18n.changeLanguage(defaultLang);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating new user with role:', role);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
        preferred_language: i18n.language || navigator.language.split('-')[0] || 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log('User created successfully, navigating to onboarding');
      navigate(`/${role}/onboarding`);
    } catch (error: any) {
      console.error('SignUp error:', error);
      toast({
        title: t('auth.signUp.error.title'),
        description: t('auth.signUp.error.description'),
        variant: "destructive"
      });
    }
  };

  return (
    <AuthLayout title={t('auth.signUp')}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <form className="space-y-4" onSubmit={handleSignUp}>
        <Input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          {t('auth.signUp')}
        </Button>
        <div className="text-center text-sm text-secondary">
          {t('auth.signUp.alreadyHaveAccount')}{' '}
          <Link to="/signin" className="text-primary hover:text-primary/80">
            {t('auth.signIn')}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;