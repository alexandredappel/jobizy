import { 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ApplicationVerifier,
} from 'firebase/auth';
import { doc, setDoc, Timestamp, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, WorkerProfile, BusinessProfile } from '@/types/database.types';
import bcrypt from 'bcryptjs';

export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private recaptchaVerifier: ApplicationVerifier | null = null;

  // Initialisation du reCAPTCHA
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
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  // Utilitaire pour hasher les mots de passe
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
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

      // Vérifier si le numéro existe déjà
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('PHONE_ALREADY_EXISTS');
      }

      // Hasher le mot de passe
      const hashedPassword = await this.hashPassword(password);
      
      // Envoyer l'OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );

      // Stocker les données temporairement
      sessionStorage.setItem('tempSignupData', JSON.stringify({
        role,
        hashedPassword,
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

      const { role, hashedPassword, profileData } = JSON.parse(tempDataStr);
      
      const userData = {
        id: result.user.uid,
        phoneNumber: result.user.phoneNumber!,
        role,
        password: hashedPassword,
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isVerified: true
      };

      await setDoc(doc(db, 'users', result.user.uid), userData);
      sessionStorage.removeItem('tempSignupData');
      
      return {
        ...userData,
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate()
      } as User;
    } catch (error: any) {
      throw error;
    }
  }

  // SIGNIN - Authentification avec téléphone et mot de passe
  async signInWithPhone(phoneNumber: string, password: string): Promise<User> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('RECAPTCHA_NOT_INITIALIZED');
      }

      // 1. Rechercher l'utilisateur
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('USER_NOT_FOUND');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 2. Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, userData.password);
      if (!isValidPassword) {
        throw new Error('INVALID_PASSWORD');
      }

      // 3. Connecter l'utilisateur et retourner ses données
      return {
        ...userData,
        id: userDoc.id,
        createdAt: userData.createdAt instanceof Timestamp 
          ? userData.createdAt.toDate() 
          : new Date(userData.createdAt),
        updatedAt: userData.updatedAt instanceof Timestamp 
          ? userData.updatedAt.toDate() 
          : new Date(userData.updatedAt)
      } as User;
    } catch (error: any) {
      console.error('Sign in error:', error);
      this.clearRecaptcha();
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
