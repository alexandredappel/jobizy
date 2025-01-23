import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting to sign in with:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Connectez-vous à votre compte">
      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
        <div className="flex flex-col gap-2 text-center text-sm">
          <Link 
            to="/forgot-password"
            className="text-primary hover:text-primary/80"
          >
            Mot de passe oublié ?
          </Link>
          <span className="text-secondary">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80">
              Inscrivez-vous
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;