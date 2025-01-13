import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password, rememberMe);
      // Redirect based on user role
      if (user?.role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/business/dashboard');
      }
    } catch (error) {
      // Error is handled by AuthContext
      console.error('SignIn error:', error);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold text-secondary">Sign In to Jobizy</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">Remember me</Label>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </>
  );
};

export default SignIn;