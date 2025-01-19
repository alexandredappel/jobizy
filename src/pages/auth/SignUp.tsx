import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/layouts/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'worker' | 'business'>('worker');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        email,
        userType,
        createdAt: new Date().toISOString(),
      });
      navigate(`/${userType}/onboarding`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthLayout title="Create your Jobizy Account">
      <form className="space-y-4" onSubmit={handleSignUp}>
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
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <div className="text-center text-sm text-secondary">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary hover:text-primary/80">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;