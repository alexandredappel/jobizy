import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config';
import { User, SignUpData, AuthError } from '@/types/auth';
import { handleFirebaseError } from '../utils/auth/validation';
import { checkLockout, incrementFailedAttempts, resetFailedAttempts } from '../utils/auth/lockout';

export class AuthService {
  async signUp(data: SignUpData): Promise<User> {
    try {
      console.log('AuthService: Attempting to sign up user', { email: data.email });
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const { user: firebaseUser } = userCredential;

      const userData: User = {
        id: firebaseUser.uid,
        email: data.email,
        role: data.role,
        phoneNumber: 'phoneNumber' in data ? data.phoneNumber : undefined,
        firstName: 'firstName' in data ? data.firstName : undefined,
        company_name: 'company_name' in data ? data.company_name : undefined,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('AuthService: User successfully signed up', { userId: userData.id });
      
      return userData;
    } catch (error: any) {
      console.error('AuthService: Sign up error', error);
      throw handleFirebaseError(error);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('AuthService: Attempting to sign in user', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        console.error('AuthService: User data not found');
        throw new AuthError('User data not found', 'auth/user-not-found');
      }

      const isLocked = await checkLockout(firebaseUser.uid);
      if (isLocked) {
        console.error('AuthService: Account is temporarily locked');
        throw new AuthError('Account is temporarily locked', 'auth/too-many-requests');
      }

      await resetFailedAttempts(firebaseUser.uid);
      console.log('AuthService: User successfully signed in', { userId: firebaseUser.uid });
      return userDoc.data() as User;
    } catch (error: any) {
      console.error('AuthService: Sign in error', error);
      if (auth.currentUser) {
        await incrementFailedAttempts(auth.currentUser.uid);
      }
      throw handleFirebaseError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      console.log('AuthService: Attempting to sign out user');
      await firebaseSignOut(auth);
      console.log('AuthService: User successfully signed out');
    } catch (error: any) {
      console.error('AuthService: Sign out error', error);
      throw handleFirebaseError(error);
    }
  }

  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? this.convertFirebaseUser(firebaseUser) : null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        callback(userDoc.exists() ? userDoc.data() as User : null);
      } else {
        callback(null);
      }
    });
  }

  private convertFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      role: 'worker', // Default role, should be fetched from Firestore
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  }
}