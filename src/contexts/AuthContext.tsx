import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/auth';
import { MockAuthService } from '@/services/mocks/services/MockAuthService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (email: string, password: string, role: 'worker' | 'business') => Promise<void>;
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

  const signUp = async (email: string, password: string, role: 'worker' | 'business') => {
    try {
      setLoading(true);
      setError(null);
      await authService.signUp({ email, password, role });
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