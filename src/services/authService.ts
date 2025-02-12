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
      if (!this.recaptchaVerifier) {
        throw new Error('RECAPTCHA_NOT_INITIALIZED');
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Vérifier si le numéro existe déjà
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', formattedPhone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('PHONE_ALREADY_EXISTS');
      }
      
      // Envoyer l'OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        this.recaptchaVerifier
      );

      // Stocker les données temporairement SANS le mot de passe
      sessionStorage.setItem('tempSignupData', JSON.stringify({
        role,
        profileData
      }));

      return { confirmationResult };
    } catch (error: any) {
      this.clearRecaptcha();
      throw error;
    }
  }

  // SIGNUP - Étape 2: Vérification OTP et création du compte
  async verifyOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      const result = await confirmationResult.confirm(code);
      const tempDataStr = sessionStorage.getItem('tempSignupData');
      
      if (!tempDataStr) {
        throw new Error('TEMP_DATA_NOT_FOUND');
      }

      const { role, profileData } = JSON.parse(tempDataStr);
      
      const userData = {
        id: result.user.uid,
        phoneNumber: result.user.phoneNumber!,
        role,
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isVerified: true
      };

      await setDoc(doc(db, 'users', result.user.uid), userData);
      sessionStorage.removeItem('tempSignupData');
      
      return {
        ...userData,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      } as User;
    } catch (error: any) {
      throw error;
    }
  }

  // SIGNIN - Authentification avec téléphone et vérification OTP
  async signInWithPhone(phoneNumber: string, password: string): Promise<{ confirmationResult: any }> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const appVerifier = this.initRecaptcha('recaptcha-container');
      
      // Envoyer le code de vérification
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      return { confirmationResult };
    } catch (error: any) {
      this.clearRecaptcha();
      throw error;
    }
  }

  // SIGNIN - Vérification du code OTP pour la connexion
  async verifySignInOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      const userCredential = await confirmationResult.confirm(code);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
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
