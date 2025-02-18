
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

  constructor() {
    this.phoneAuthProvider = new PhoneAuthProvider(auth);
  }

  initRecaptcha(containerId: string) {
    try {
      console.log('Initializing reCAPTCHA with container:', containerId);
      if (!this.recaptchaVerifier) {
        this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible'
        });
        console.log('reCAPTCHA initialized successfully');
      } else {
        console.log('reCAPTCHA already initialized');
      }
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      throw new Error('Failed to initialize reCAPTCHA');
    }
  }

  clearRecaptcha() {
    try {
      console.log('Clearing reCAPTCHA...');
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
        console.log('reCAPTCHA cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing reCAPTCHA:', error);
    }
  }

  async verifyPhoneNumber(phoneNumber: string) {
    console.log('Starting phone verification process...');
    
    if (!this.recaptchaVerifier) {
      console.error('reCAPTCHA not initialized');
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    try {
      console.log('Verifying phone number:', phoneNumber);
      const confirmationResult = await this.phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        this.recaptchaVerifier
      );
      console.log('Phone verification successful');

      return { confirmationResult };
    } catch (error: any) {
      console.error('Phone verification error:', error);
      throw error;
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

      // Pour l'inscription, on va créer un nouveau document utilisateur
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
