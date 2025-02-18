import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail, 
  updateProfile, 
  RecaptchaVerifier, 
  PhoneAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  async signUpWithPhone(
    phoneNumber: string,
    password: string,
    role: 'worker' | 'business',
    additionalData: Partial<User>
  ) {
    console.log('Starting phone signup process...');
    
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
      console.error('Phone signup error:', error);
      throw error;
    }
  }

  async verifyOTP(confirmationResult: any, verificationCode: string) {
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

      console.error('User document not found after OTP verification');
      throw new Error('User document not found');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  async signInWithPhone(phoneNumber: string, password: string) {
    console.log('Starting phone sign in process...');
    
    if (!this.recaptchaVerifier) {
      console.error('reCAPTCHA not initialized');
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    try {
      console.log('Verifying phone number for sign in:', phoneNumber);
      const confirmationResult = await this.phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        this.recaptchaVerifier
      );
      console.log('Phone verification successful for sign in');

      return { confirmationResult };
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      throw error;
    }
  }

  async verifySignInOTP(confirmationResult: any, verificationCode: string) {
    console.log('Starting sign in OTP verification...');
    
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;
      console.log('Sign in OTP verified successfully for user:', user.uid);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('Found user document for sign in');
        return userDoc.data() as User;
      }

      console.error('User document not found after sign in OTP verification');
      throw new Error('User document not found');
    } catch (error: any) {
      console.error('Sign in OTP verification error:', error);
      throw error;
    }
  }

  async registerBusiness(
    email: string,
    password: string,
    companyName: string,
    businessType: BusinessType,
    location: WorkArea[],
    phoneNumber: string,
    role: 'business'
  ): Promise<User> {
    try {
      console.log('Starting business registration process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const businessData: BusinessUser = {
        id: user.uid,
        role: 'business',
        email: email,
        company_name: companyName,
        business_type: businessType,
        location: location,
        phoneNumber: phoneNumber,
        created_at: new Date(),
        updated_at: new Date(),
        languages: [], // Ajout du champ languages requis
      };

      console.log('Creating business document in Firestore...');
      await setDoc(doc(db, "users", user.uid), businessData);
      console.log('Business registration completed successfully');
      
      return businessData;
    } catch (error: any) {
      console.error('Business registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
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

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
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
