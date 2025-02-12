
import { 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ApplicationVerifier,
  signInWithCredential,
  PhoneAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, WorkerProfile, BusinessProfile } from '@/types/database.types';

export class AuthService {
  private recaptchaVerifier: ApplicationVerifier | null = null;

  // Initialisation du reCAPTCHA (uniquement pour signup)
  initRecaptcha(elementId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        }
      });
    }
    return this.recaptchaVerifier;
  }

  // Nettoyage du reCAPTCHA
  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      (this.recaptchaVerifier as any).clear?.();
      this.recaptchaVerifier = null;
    }
  }

  // Utilitaire pour convertir les Timestamps
  private convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  // Utilitaire pour formater le numéro de téléphone
  private formatPhoneNumber(phoneNumber: string): string {
    console.log('Formatting phone number:', phoneNumber);
    
    // Nettoyer le numéro (garder uniquement les chiffres)
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    console.log('Cleaned number:', cleanNumber);
    
    // Si le numéro commence par 0, le supprimer
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.slice(1);
      console.log('Removed leading 0:', cleanNumber);
    }
    
    // Si le numéro ne commence pas par 62, l'ajouter
    if (!cleanNumber.startsWith('62')) {
      cleanNumber = '62' + cleanNumber;
      console.log('Added country code:', cleanNumber);
    }
    
    // Ajouter le +
    const formattedNumber = '+' + cleanNumber;
    console.log('Final formatted number:', formattedNumber);
    
    return formattedNumber;
  }

  // SIGNUP - Étape 1: Vérification initiale et envoi OTP
  async signUpWithPhone(
    phoneNumber: string,
    password: string,
    role: UserRole,
    profileData: Partial<WorkerProfile | BusinessProfile>
  ): Promise<{ confirmationResult: any }> {
    try {
      console.log('=== DEBUG SIGNUP START ===');
      console.log('Phone number:', phoneNumber);
      console.log('Password:', password);
      console.log('Role:', role);
      console.log('Profile data:', profileData);

      if (!this.recaptchaVerifier) {
        throw new Error('RECAPTCHA_NOT_INITIALIZED');
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      console.log('Formatted phone:', formattedPhone);

      // Vérifier si le numéro existe déjà
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', formattedPhone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log('Phone number already exists');
        throw new Error('PHONE_ALREADY_EXISTS');
      }
      
      // Envoyer l'OTP
      console.log('Sending OTP...');
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier
      );
      console.log('OTP sent successfully');

      // Stocker les données temporairement SANS le mot de passe
      const tempData = {
        role,
        profileData
      };
      console.log('Storing temp data:', tempData);
      sessionStorage.setItem('tempSignupData', JSON.stringify(tempData));

      console.log('=== DEBUG SIGNUP END ===');
      return { confirmationResult };
    } catch (error: any) {
      console.error('Signup error:', error);
      this.clearRecaptcha();
      throw error;
    }
  }

  // SIGNUP - Étape 2: Vérification OTP et création du compte
  async verifyOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      console.log('=== DEBUG VERIFY OTP START ===');
      console.log('Verification code:', code);

      const result = await confirmationResult.confirm(code);
      console.log('OTP confirmed successfully');

      const tempDataStr = sessionStorage.getItem('tempSignupData');
      console.log('Retrieved temp data:', tempDataStr);
      
      if (!tempDataStr) {
        console.error('No temp data found');
        throw new Error('TEMP_DATA_NOT_FOUND');
      }

      const { role, profileData } = JSON.parse(tempDataStr);
      console.log('Parsed temp data - Role:', role);
      console.log('Parsed temp data - Profile:', profileData);
      
      const userData = {
        id: result.user.uid,
        phoneNumber: result.user.phoneNumber!,
        role,
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isVerified: true
      };
      console.log('Created user data:', userData);

      await setDoc(doc(db, 'users', result.user.uid), userData);
      console.log('User data saved to Firestore');
      
      sessionStorage.removeItem('tempSignupData');
      console.log('Temp data cleared');

      console.log('=== DEBUG VERIFY OTP END ===');
      return {
        ...userData,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      } as User;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  // SIGNIN - Authentification avec téléphone et vérification OTP
  async signInWithPhone(phoneNumber: string, password: string): Promise<{ confirmationResult: any }> {
    try {
      console.log('=== DEBUG SIGNIN START ===');
      console.log('Phone number:', phoneNumber);
      console.log('Password:', password);
      console.log('Password length:', password.length);
      console.log('Password type:', typeof password);

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      console.log('Formatted phone:', formattedPhone);

      const appVerifier = this.initRecaptcha('recaptcha-container');
      console.log('reCAPTCHA initialized');
      
      // Envoyer le code de vérification
      console.log('Sending verification code...');
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      console.log('Verification code sent successfully');
      
      console.log('=== DEBUG SIGNIN END ===');
      return { confirmationResult };
    } catch (error: any) {
      console.error('Sign in error:', error);
      this.clearRecaptcha();
      throw error;
    }
  }

  // SIGNIN - Vérification du code OTP pour la connexion
  async verifySignInOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      console.log('=== DEBUG VERIFY SIGNIN OTP START ===');
      console.log('Verification code:', code);

      const userCredential = await confirmationResult.confirm(code);
      console.log('OTP confirmed successfully');

      const user = userCredential.user;
      console.log('Firebase user:', user);

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error('User document not found in Firestore');
        throw new Error('USER_NOT_FOUND');
      }

      const userData = userDocSnap.data() as User;
      console.log('User data retrieved:', userData);

      console.log('=== DEBUG VERIFY SIGNIN OTP END ===');
      return {
        ...userData,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      };
    } catch (error: any) {
      console.error('Verify signin OTP error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('INVALID_VERIFICATION_CODE');
      }
      throw error;
    }
  }

  // Déconnexion
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw error;
    }
  }

  // Récupérer l'utilisateur courant
  getCurrentUser() {
    return auth.currentUser;
  }
}
