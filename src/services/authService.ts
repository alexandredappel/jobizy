import { 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ApplicationVerifier
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/firebase.types';

export class AuthService {
  private recaptchaVerifier: ApplicationVerifier | null = null;
  private isRecaptchaInitialized: boolean = false;

  async initRecaptcha(elementId: string): Promise<void> {
    try {
      console.log('Initializing reCAPTCHA...');
      if (!this.recaptchaVerifier) {
        this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved successfully');
            this.isRecaptchaInitialized = true;
          }
        });
        console.log('reCAPTCHA initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      this.clearRecaptcha();
      throw error;
    }
  }

  async clearRecaptcha() {
    try {
      console.log('Clearing reCAPTCHA...');
      if (this.recaptchaVerifier) {
        (this.recaptchaVerifier as any).clear?.();
        this.recaptchaVerifier = null;
        this.isRecaptchaInitialized = false;
        console.log('reCAPTCHA cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing reCAPTCHA:', error);
      this.recaptchaVerifier = null;
      this.isRecaptchaInitialized = false;
    }
  }

  async verifyRecaptchaStatus(): Promise<boolean> {
    return !!this.recaptchaVerifier && this.isRecaptchaInitialized;
  }

  async verifyPhoneNumber(phoneNumber: string, isSignUp: boolean = false) {
    console.log('Starting phone verification process...');
    
    if (!this.recaptchaVerifier) {
      console.error('reCAPTCHA not initialized');
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log('Verifying phone number:', formattedPhone);

      if (isSignUp) {
        const userDoc = await this.findUserByPhoneNumber(formattedPhone);
        if (userDoc) {
          throw new Error('PHONE_ALREADY_EXISTS');
        }
      } else {
        const userDoc = await this.findUserByPhoneNumber(formattedPhone);
        if (!userDoc) {
          throw new Error('USER_NOT_FOUND');
        }
      }

      console.log('Sending verification code...');
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier
      );
      console.log('Verification code sent successfully');

      return { confirmationResult };
    } catch (error: any) {
      console.error('Phone verification error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        throw new Error('TOO_MANY_REQUESTS');
      }
      if (error.code === 'auth/invalid-phone-number') {
        throw new Error('INVALID_PHONE_NUMBER');
      }
      
      throw error;
    }
  }

  private async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      return null;
    } catch (error) {
      console.error('Error finding user by phone number:', error);
      return null;
    }
  }

  async verifyOTP(confirmationResult: any, verificationCode: string, isSignUp: boolean = false) {
    console.log('Starting OTP verification...');
    
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;
      console.log('OTP verified successfully for user:', user.uid);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('Found existing user document');
        return userDoc.data() as User;
      }

      if (!isSignUp) {
        console.error('User document not found during sign in');
        throw new Error('USER_NOT_FOUND');
      }

      console.log('Creating new user document for sign up');
      const newUserData: Partial<User> = {
        id: user.uid,
        phone_number: user.phoneNumber,
        created_at: new Date(),
        updated_at: new Date(),
        languages: []
      };

      await setDoc(userDocRef, newUserData);
      return newUserData as User;

    } catch (error: any) {
      console.error('OTP verification error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('INVALID_OTP');
      }
      if (error.code === 'auth/code-expired') {
        throw new Error('OTP_EXPIRED');
      }
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}
