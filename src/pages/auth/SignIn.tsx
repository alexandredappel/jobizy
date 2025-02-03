import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting to sign in with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');

      // Fetch user data to get role
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || userData.userType;
        console.log('User role:', userRole);
        
        // Redirect based on role
        if (userRole === 'worker') {
          navigate('/worker/dashboard');
        } else if (userRole === 'business') {
          navigate('/business/dashboard');
        } else {
          console.error('Invalid user role:', userRole);
          toast({
            title: "Error",
            description: "Invalid user role",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.signIn')}>
      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {isLoading ? "Signing in..." : t('auth.signIn')}
        </Button>
        <div className="flex flex-col gap-2 text-center text-sm">
          <Link 
            to="/forgot-password"
            className="text-primary hover:text-primary/80"
          >
            {t('auth.forgotPassword')}
          </Link>
          <span className="text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80">
              {t('auth.signUp')}
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
