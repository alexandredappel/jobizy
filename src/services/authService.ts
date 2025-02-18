
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, updateProfile, RecaptchaVerifier } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  User,
  WorkerUser,
  BusinessUser,
  BusinessType,
  WorkArea
} from '@/types/firebase.types';

export class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  initRecaptcha(containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  }

  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  async signUpWithPhone(
    phoneNumber: string,
    password: string,
    role: 'worker' | 'business',
    additionalData: Partial<User>
  ) {
    if (!this.recaptchaVerifier) {
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    const confirmationResult = await auth.signInWithPhoneNumber(
      phoneNumber,
      this.recaptchaVerifier
    );

    return { confirmationResult };
  }

  async verifyOTP(confirmationResult: any, verificationCode: string) {
    const userCredential = await confirmationResult.confirm(verificationCode);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }

    throw new Error('User document not found');
  }

  async signInWithPhone(phoneNumber: string, password: string) {
    if (!this.recaptchaVerifier) {
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    const confirmationResult = await auth.signInWithPhoneNumber(
      phoneNumber,
      this.recaptchaVerifier
    );

    return { confirmationResult };
  }

  async verifySignInOTP(confirmationResult: any, verificationCode: string) {
    const userCredential = await confirmationResult.confirm(verificationCode);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }

    throw new Error('User document not found');
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async registerBusiness(
    email: string,
    password: string,
    companyName: string,
    businessType: BusinessType,
    location: WorkArea,
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
