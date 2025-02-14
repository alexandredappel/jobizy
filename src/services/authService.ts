import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, UserCredential, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/config/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export class AuthService {
  public async signInWithPhone(phoneNumber: string, password: string) {
    try {
      // Vérifier que l'utilisateur existe
      const userDoc = await this.findUserByPhone(phoneNumber);
      if (!userDoc.exists()) {
        throw new Error('USER_NOT_FOUND');
      }

      const userData = userDoc.data();
      return {
        confirmationResult: true,
        user: {
          id: userDoc.id,
          role: userData?.role || 'worker'
        }
      };
    } catch (error) {
      console.error('Phone sign in error:', error);
      throw error;
    }
  }

  private async findUserByPhone(phoneNumber: string) {
    const userDocRef = doc(db, 'users', phoneNumber);
    return await getDoc(userDocRef);
  }

  public async verifySignInOTP(confirmationResult: ConfirmationResult, verificationCode: string): Promise<any> {
    try {
      const result: UserCredential = await confirmationResult.confirm(verificationCode);
      const user = result.user;

      // Récupérer les informations de l'utilisateur depuis Firestore
      const userDocRef = doc(db, 'users', user.phoneNumber || '');
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.error('User data not found in Firestore');
        return null;
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}
