import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-secondary">Sign In to Jobizy</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <Link 
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 text-center"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;