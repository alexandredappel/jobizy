import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('worker');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, userType);
      navigate(`/${userType}/onboarding`);
    } catch (error) {
      // Error is handled by AuthContext
      console.error('SignUp error:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-secondary">Create your Jobizy Account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
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
            <div className="flex gap-4">
              <Button
                type="button"
                variant={userType === 'worker' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setUserType('worker')}
              >
                I'm a Worker
              </Button>
              <Button
                type="button"
                variant={userType === 'business' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setUserType('business')}
              >
                I'm a Business
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;