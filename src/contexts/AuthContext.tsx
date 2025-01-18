import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { User } from '@/types/database.types';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Convert Timestamp to Date for createdAt and updatedAt
            setUser({
              ...userData,
              id: firebaseUser.uid,
              createdAt: userData.createdAt instanceof Timestamp 
                ? userData.createdAt.toDate() 
                : new Date(userData.createdAt),
              updatedAt: userData.updatedAt instanceof Timestamp 
                ? userData.updatedAt.toDate() 
                : new Date(userData.updatedAt)
            } as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    if (!firebaseLoading) {
      fetchUserData();
    }
  }, [firebaseUser, firebaseLoading]);

  return (
    <AuthContext.Provider value={{ user, loading: loading || firebaseLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);