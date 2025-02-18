import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  User,
  WorkerUser,
  BusinessUser
} from '@/types/firebase.types';

export class AuthService {
  async register(
    email: string, 
    password: string, 
    fullName: string,
    phone_number: string,
    role: 'worker'
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const workerData: WorkerUser = {
        id: user.uid,
        role: 'worker',
        email: email,
        phone_number: phone_number,
        full_name: fullName,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        availability_status: true,
      };

      await setDoc(doc(db, "users", user.uid), workerData);
      return workerData;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw new Error(error.message);
    }
  }

  async registerBusiness(
    email: string,
    password: string,
    companyName: string,
    businessType: string,
    location: string,
    phone_number: string,
    role: 'business'
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const businessData: BusinessUser = {
        id: user.uid,
        role: 'business',
        email: email,
        company_name: companyName,
        business_type: businessType,
        location: location,
        phone_number: phone_number,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      await setDoc(doc(db, "users", user.uid), businessData);
      return businessData;
    } catch (error: any) {
      console.error('Business registration error:', error);
      throw new Error(error.message);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        const userDoc = await doc(db, 'users', user.uid).get();
        if (userDoc.exists()) {
          return userDoc.data() as User;
        } else {
          throw new Error('User data not found in Firestore');
        }
      } else {
        throw new Error('Could not retrieve current user');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw new Error(error.message);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw new Error(error.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Reset password error:', error.message);
      throw new Error(error.message);
    }
  }

  async updateProfile(userId: string, data: { displayName: string; photoURL: string }): Promise<void> {
    try {
      await updateProfile(auth.currentUser as any, data);
      
      // Update the user document in Firestore
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        displayName: data.displayName,
        photoURL: data.photoURL
      }, { merge: true });

    } catch (error: any) {
      console.error('Update profile error:', error.message);
      throw new Error(error.message);
    }
  }
}
