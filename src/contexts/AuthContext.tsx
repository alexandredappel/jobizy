import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, SignUpData } from '@/types/auth';
import { MockAuthService } from '@/services/mocks/services/MockAuthService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (email: string, password: string, role: 'worker' | 'business', additionalData?: { phoneNumber?: string; firstName?: string; company_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authService = new MockAuthService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, remember: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      authService.setPersistence(remember);
      await authService.signIn(email, password);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    role: 'worker' | 'business',
    additionalData?: { phoneNumber?: string; firstName?: string; company_name?: string }
  ) => {
    try {
      setLoading(true);
      setError(null);

      let signUpData: SignUpData;
      
      if (role === 'worker') {
        if (!additionalData?.phoneNumber) {
          throw new Error('Phone number is required for workers');
        }
        signUpData = {
          email,
          password,
          role: 'worker',
          phoneNumber: additionalData.phoneNumber,
          firstName: additionalData.firstName
        };
      } else {
        signUpData = {
          email,
          password,
          role: 'business',
          company_name: additionalData?.company_name
        };
      }

      await authService.signUp(signUpData);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};