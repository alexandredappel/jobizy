
import { 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ApplicationVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, WorkerProfile, BusinessProfile } from '@/types/database.types';

export class AuthService {
  private recaptchaVerifier: ApplicationVerifier | null = null;

  initRecaptcha(elementId: string): ApplicationVerifier {
    if (this.recaptchaVerifier) {
      try {
        (this.recaptchaVerifier as any).clear?.();
      } catch (error) {
        console.warn('Failed to clear existing reCAPTCHA:', error);
      }
      this.recaptchaVerifier = null;
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        this.clearRecaptcha();
      }
    });

    return this.recaptchaVerifier;
  }

  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      try {
        (this.recaptchaVerifier as any).clear?.();
      } catch (error) {
        console.warn('Failed to clear reCAPTCHA:', error);
      }
      this.recaptchaVerifier = null;
    }
  }

  private convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  private formatPhoneNumber(phoneNumber: string): string {
    console.log('Formatting phone number:', phoneNumber);
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.slice(1);
    }
    
    if (!cleanNumber.startsWith('62')) {
      cleanNumber = '62' + cleanNumber;
    }
    
    const formattedNumber = '+' + cleanNumber;
    console.log('Final formatted number:', formattedNumber);
    
    return formattedNumber;
  }

  private handleFirebaseError(error: any): never {
    console.error('Firebase error:', error);
    
    const errorCode = error.code || (error.message && error.message.includes('TOO_MANY_ATTEMPTS_TRY_LATER') ? 'auth/too-many-requests' : 'unknown');
    
    switch (errorCode) {
      case 'auth/too-many-requests':
        throw new Error('TOO_MANY_ATTEMPTS');
      case 'auth/invalid-phone-number':
        throw new Error('INVALID_PHONE_NUMBER');
      case 'auth/invalid-verification-code':
        throw new Error('INVALID_VERIFICATION_CODE');
      case 'auth/code-expired':
        throw new Error('CODE_EXPIRED');
      default:
        throw error;
    }
  }

  async signInWithPhone(phoneNumber: string, password: string): Promise<{ confirmationResult: any }> {
    try {
      console.log('=== DEBUG SIGNIN START ===');
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      console.log('Formatted phone:', formattedPhone);

      if (!this.recaptchaVerifier) {
        throw new Error('RECAPTCHA_NOT_INITIALIZED');
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      console.log('Verification code sent successfully');
      
      return { confirmationResult };
    } catch (error: any) {
      this.clearRecaptcha();
      throw this.handleFirebaseError(error);
    }
  }

  async signUpWithPhone(
    phoneNumber: string, 
    password: string, 
    role: UserRole,
    profileData: Partial<WorkerProfile | BusinessProfile>
  ): Promise<{ confirmationResult: any }> {
    try {
      console.log('=== DEBUG SIGNUP START ===');
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      console.log('Formatted phone:', formattedPhone);

      if (!this.recaptchaVerifier) {
        throw new Error('RECAPTCHA_NOT_INITIALIZED');
      }

      // Vérifier si le numéro existe déjà
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', formattedPhone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('PHONE_ALREADY_EXISTS');
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier);
      
      // Stocker les données temporairement pour l'utilisation après vérification OTP
      const tempData = {
        role,
        profileData: {
          ...profileData,
          phoneNumber: formattedPhone,
        }
      };
      sessionStorage.setItem('tempSignupData', JSON.stringify(tempData));
      
      return { confirmationResult };
    } catch (error: any) {
      this.clearRecaptcha();
      throw this.handleFirebaseError(error);
    }
  }

  async verifyOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      console.log('=== DEBUG VERIFY OTP START ===');
      const result = await confirmationResult.confirm(code);
      
      const tempDataStr = sessionStorage.getItem('tempSignupData');
      if (!tempDataStr) {
        throw new Error('TEMP_DATA_NOT_FOUND');
      }

      const { role, profileData } = JSON.parse(tempDataStr);
      
      const userData = {
        id: result.user.uid,
        role,
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      // Nettoyer les données temporaires
      sessionStorage.removeItem('tempSignupData');

      return {
        ...userData,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      };
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    } finally {
      this.clearRecaptcha();
    }
  }

  async verifySignInOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      console.log('=== DEBUG VERIFY SIGNIN OTP START ===');
      const userCredential = await confirmationResult.confirm(code);
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('USER_NOT_FOUND');
      }

      const userData = userDocSnap.data() as User;
      return {
        ...userData,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      };
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    } finally {
      this.clearRecaptcha();
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}
