
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

  constructor() {
    this.phoneAuthProvider = new PhoneAuthProvider(auth);
  }

  async initRecaptcha(containerId: string): Promise<void> {
    if (this.isRecaptchaInitialized) {
      console.log('reCAPTCHA already initialized');
      return;
    }

    try {
      console.log('Initializing reCAPTCHA with container:', containerId);
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.clearRecaptcha();
        }
      });
      
      // Forcer le rendu pour vérifier que tout est ok
      await this.recaptchaVerifier.render();
      this.isRecaptchaInitialized = true;
      console.log('reCAPTCHA initialized and rendered successfully');
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      this.clearRecaptcha();
      throw new Error('Failed to initialize reCAPTCHA');
    }
  }

  clearRecaptcha() {
    try {
      console.log('Clearing reCAPTCHA...');
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
        this.isRecaptchaInitialized = false;
        console.log('reCAPTCHA cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing reCAPTCHA:', error);
    }
  }

  async verifyPhoneNumber(phoneNumber: string, isSignUp: boolean = false) {
    console.log('Starting phone verification process...');
    
    if (!this.isRecaptchaInitialized || !this.recaptchaVerifier) {
      console.error('reCAPTCHA not initialized');
      throw new Error('RECAPTCHA_NOT_INITIALIZED');
    }

    try {
      // Pour l'inscription, vérifier si le numéro existe déjà
      if (isSignUp) {
        const userQuery = await this.findUserByPhoneNumber(phoneNumber);
        if (userQuery) {
          throw new Error('PHONE_ALREADY_EXISTS');
        }
      } else {
        // Pour la connexion, vérifier si le numéro existe
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
      
      // Gérer les erreurs spécifiques
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
      // Ici, vous devriez implémenter la logique pour trouver un utilisateur par numéro de téléphone
      // Pour l'instant, on retourne null car cette fonctionnalité n'est pas encore implémentée
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
