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
import { IAuthService } from '@/services/interfaces/authService.interface';

export class FirebaseAuthService implements IAuthService {
  async signUp(data: SignUpData): Promise<User> {
    try {
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
      
      return userData;
    } catch (error: any) {
      throw handleFirebaseError(error);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new AuthError('User data not found', 'auth/user-not-found');
      }

      const isLocked = await checkLockout(firebaseUser.uid);
      if (isLocked) {
        throw new AuthError('Account is temporarily locked', 'auth/too-many-requests');
      }

      await resetFailedAttempts(firebaseUser.uid);
      return userDoc.data() as User;
    } catch (error: any) {
      if (auth.currentUser) {
        await incrementFailedAttempts(auth.currentUser.uid);
      }
      throw handleFirebaseError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
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