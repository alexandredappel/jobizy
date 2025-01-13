import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('worker');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[a-z]/.test(pass)) strength += 25;
    if (/\d/.test(pass)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 100) {
      console.error('Password does not meet requirements');
      return;
    }

    try {
      await signUp(email, password, userType);
      navigate(`/${userType}/onboarding`);
    } catch (error) {
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
              <Progress value={passwordStrength} className={getStrengthColor()} />
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>One uppercase letter</li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>One lowercase letter</li>
                <li className={/\d/.test(password) ? 'text-green-600' : ''}>One number</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
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
          <Button 
            type="submit" 
            className="w-full"
            disabled={password !== confirmPassword || passwordStrength < 100}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;