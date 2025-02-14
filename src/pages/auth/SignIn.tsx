
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AuthLayout } from '@/layouts/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

const SignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      if (userCredential.user) {
        const userData = {
          id: userCredential.user.uid,
          email: userCredential.user.email || undefined,
          role: 'worker' as const, // Explicitly type as 'worker'
        };
        setUser(userData);
        navigate('/worker/onboarding');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
