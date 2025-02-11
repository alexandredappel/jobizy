import { 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ApplicationVerifier,
} from 'firebase/auth';
import { doc, setDoc, updateDoc, Timestamp, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, WorkerProfile, BusinessProfile } from '@/types/database.types';
import bcryptjs from 'bcryptjs';

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
      (this.recaptchaVerifier as any).clear?.();
      this.recaptchaVerifier = null;
    }
  }

  // Utilitaire pour hasher les mots de passe
  private async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, this.SALT_ROUNDS);
  }

  // Utilitaire pour convertir les Timestamps
  private convertTimestamp(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  // Utilitaire pour vérifier si un mot de passe est hashé
  private isPasswordHashed(password: string): boolean {
    return password.startsWith('$2a$') || password.startsWith('$2b$');
  }

  // Utilitaire pour formater le numéro de téléphone
  private formatPhoneNumber(phoneNumber: string): string {
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.slice(1);
    }
    if (!cleanNumber.startsWith('62')) {
      cleanNumber = '62' + cleanNumber;
    }
    return '+' + cleanNumber;
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

      // Hasher le mot de passe
      const hashedPassword = await this.hashPassword(password);
      
      // Envoyer l'OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
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
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      } as User;
    } catch (error: any) {
      throw error;
    }
  }

  // SIGNIN - Authentification avec téléphone et mot de passe
  async signInWithPhone(phoneNumber: string, password: string): Promise<User> {
    try {
      // 1. Formater le numéro de téléphone
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // 2. Rechercher l'utilisateur
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', formattedPhone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('USER_NOT_FOUND');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User;

      // 3. Vérifier si le mot de passe doit être migré
      let isValidPassword = false;
      if (!this.isPasswordHashed(userData.password)) {
        // Ancien format : hasher le mot de passe et mettre à jour
        if (userData.password === password) { // Comparaison directe pour les anciens mots de passe
          const hashedPassword = await this.hashPassword(password);
          await updateDoc(doc(db, 'users', userDoc.id), {
            password: hashedPassword,
            updatedAt: Timestamp.now(),
            passwordMigratedAt: Timestamp.now()
          });
          userData.password = hashedPassword;
          isValidPassword = true;
        }
      } else {
        // Mot de passe déjà hashé : vérification normale
        isValidPassword = await bcryptjs.compare(password, userData.password);
      }

      if (!isValidPassword) {
        throw new Error('INVALID_PASSWORD');
      }

      // 4. Connecter l'utilisateur et retourner ses données
      return {
        ...userData,
        id: userDoc.id,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt)
      } as User;
    } catch (error: any) {
      console.error('Sign in error:', error);
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
