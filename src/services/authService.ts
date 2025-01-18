import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, WorkerProfile, BusinessProfile } from '@/types/database.types';

export class AuthService {
  async signUp(
    email: string, 
    password: string, 
    role: UserRole, 
    profileData: Partial<WorkerProfile | BusinessProfile>
  ): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      
      const userData = {
        id: user.uid,
        email: user.email!,
        role,
        displayName: '',
        ...profileData,
        createdAt: new Date(Timestamp.now().toMillis()),
        updatedAt: new Date(Timestamp.now().toMillis()),
        isVerified: false
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return userData as User;
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw new Error(error.message);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      return {
        ...userData,
        createdAt: new Date((userData.createdAt as Timestamp).toMillis()),
        updatedAt: new Date((userData.updatedAt as Timestamp).toMillis())
      } as User;
    } catch (error: any) {
      console.error('SignIn error:', error);
      throw new Error(error.message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('SignOut error:', error);
      throw new Error(error.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }
  }

  async updateUserProfile(user: FirebaseUser, data: Partial<User>): Promise<void> {
    try {
      const isWorker = (data as Partial<WorkerProfile>).role === 'worker';
      const pictureUrl = isWorker 
        ? (data as Partial<WorkerProfile>).profile_picture_url 
        : (data as Partial<BusinessProfile>).logo_picture_url;

      if (data.displayName || pictureUrl) {
        await updateProfile(user, {
          displayName: data.displayName,
          photoURL: pictureUrl
        });
      }

      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message);
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}