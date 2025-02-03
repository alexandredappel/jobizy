import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/firebase.types';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating new user with role:', role);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data including email in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log('User created successfully, navigating to onboarding');
      navigate(`/${role}/onboarding`);
    } catch (error: any) {
      console.error('SignUp error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
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
          variant={role === 'worker' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('worker')}
        >
          I'm a Worker
        </Button>
        <Button
          type="button"
          variant={role === 'business' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setRole('business')}
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
  );
};

export default SignUp;