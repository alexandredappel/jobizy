import { 
  signOut as firebaseSignOut,
  RecaptchaVerifier, 
  PhoneAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/firebase.types';

export class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private phoneAuthProvider: PhoneAuthProvider;
  private isRecaptchaInitialized: boolean = false;
  private initializationAttempts: number = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;

  constructor() {
    this.phoneAuthProvider = new PhoneAuthProvider(auth);
  }

  async waitForContainer(containerId: string, maxAttempts: number = 10): Promise<boolean> {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkContainer = () => {
        attempts++;
        const container = document.getElementById(containerId);
        if (container) {
          resolve(true);
        } else if (attempts < maxAttempts) {
          setTimeout(checkContainer, 500);
        } else {
          resolve(false);
        }
      };
      checkContainer();
    });
  }

  async initRecaptcha(containerId: string): Promise<void> {
    if (this.isRecaptchaInitialized && this.recaptchaVerifier) {
      console.log('reCAPTCHA already initialized');
      return;
    }

    try {
      console.log('Waiting for container:', containerId);
      const containerExists = await this.waitForContainer(containerId);
      
      if (!containerExists) {
        console.error('reCAPTCHA container not found after waiting');
        throw new Error('RECAPTCHA_CONTAINER_NOT_FOUND');
      }

      console.log('Initializing reCAPTCHA with container:', containerId);
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback: () => {
          console.log('reCAPTCHA verified successfully');
          this.isRecaptchaInitialized = true;
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired, reinitializing...');
          this.initializationAttempts = 0;
          this.reinitializeRecaptcha(containerId);
        }
      });
      
      console.log('Attempting to render reCAPTCHA...');
      await this.recaptchaVerifier.render();
      this.isRecaptchaInitialized = true;
      this.initializationAttempts = 0;
      console.log('reCAPTCHA initialized and rendered successfully');
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      
      if (this.initializationAttempts < this.MAX_INIT_ATTEMPTS) {
        console.log(`Retrying reCAPTCHA initialization (attempt ${this.initializationAttempts + 1}/${this.MAX_INIT_ATTEMPTS})`);
        this.initializationAttempts++;
        await this.clearRecaptcha();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.initRecaptcha(containerId);
      }
      
      throw new Error('Failed to initialize reCAPTCHA after multiple attempts');
    }
  }

  private async reinitializeRecaptcha(containerId: string): Promise<void> {
    console.log('Starting reCAPTCHA reinitialization');
    await this.clearRecaptcha();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.initRecaptcha(containerId);
  }

  async clearRecaptcha() {
    try {
      console.log('Clearing reCAPTCHA...');
      if (this.recaptchaVerifier) {
        await this.recaptchaVerifier.clear();
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
    if (!this.recaptchaVerifier || !this.isRecaptchaInitialized) {
      console.log('reCAPTCHA not properly initialized');
      return false;
    }
    return true;
  }

  async verifyPhoneNumber(phoneNumber: string, isSignUp: boolean = false) {
    console.log('Starting phone verification process...');
    
    if (!this.isRecaptchaInitialized || !this.recaptchaVerifier) {
      console.error('reCAPTCHA not initialized');
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    try {
      if (isSignUp) {
        const userQuery = await this.findUserByPhoneNumber(phoneNumber);
        if (userQuery) {
          throw new Error('PHONE_ALREADY_EXISTS');
        }
      } else {
        const userQuery = await this.findUserByPhoneNumber(phoneNumber);
        if (!userQuery) {
          throw new Error('USER_NOT_FOUND');
        }
      }

      console.log('Verifying phone number:', phoneNumber);
      const confirmationResult = await this.phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        this.recaptchaVerifier
      );
      console.log('Phone verification successful');

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
    console.log(`Starting OTP verification for ${isSignUp ? 'sign up' : 'sign in'}...`);
    
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
