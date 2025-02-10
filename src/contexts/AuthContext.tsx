
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { User } from '@/types/database.types';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import i18next from 'i18next';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUser) {
        try {
          console.log('Fetching user data for:', firebaseUser.uid);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data retrieved:', userData);
            
            if (userData.preferred_language) {
              console.log('Setting language to:', userData.preferred_language);
              i18next.changeLanguage(userData.preferred_language);
            }

            setUser({
              ...userData,
              id: userDoc.id,
              createdAt: userData.createdAt instanceof Timestamp 
                ? userData.createdAt.toDate() 
                : new Date(userData.createdAt),
              updatedAt: userData.updatedAt instanceof Timestamp 
                ? userData.updatedAt.toDate() 
                : new Date(userData.updatedAt)
            } as User);
          } else {
            console.log('No user document found');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        console.log('No Firebase user');
        setUser(null);
      }
      setLoading(false);
    };

    if (!firebaseLoading) {
      fetchUserData();
    }
  }, [firebaseUser, firebaseLoading]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      loading: loading || firebaseLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
