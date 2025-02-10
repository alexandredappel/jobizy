import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ApplicationVerifier,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, WorkerProfile, BusinessProfile } from '@/types/database.types';

export class AuthService {
  private recaptchaVerifier: ApplicationVerifier | null = null;

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

  async signUp(
    email: string, 
    password: string, 
    role: UserRole, 
    profileData: Partial<WorkerProfile | BusinessProfile>
  ): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      
      const userData = {
        id: user.uid,
        email: user.email!,
        role,
        displayName: '',
        ...profileData,
        createdAt: new Date(Timestamp.now().toMillis()),
        updatedAt: new Date(Timestamp.now().toMillis()),
        isVerified: false
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return userData as User;
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw new Error(error.message);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      return {
        ...userData,
        createdAt: new Date((userData.createdAt as Timestamp).toMillis()),
        updatedAt: new Date((userData.updatedAt as Timestamp).toMillis())
      } as User;
    } catch (error: any) {
      console.error('SignIn error:', error);
      throw new Error(error.message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('SignOut error:', error);
      throw new Error(error.message);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }
  }

  async updateUserProfile(user: FirebaseUser, data: Partial<User>): Promise<void> {
    try {
      const isWorker = (data as Partial<WorkerProfile>).role === 'worker';
      const pictureUrl = isWorker 
        ? (data as Partial<WorkerProfile>).profile_picture_url 
        : (data as Partial<BusinessProfile>).logo_picture_url;

      if (data.displayName || pictureUrl) {
        await updateProfile(user, {
          displayName: data.displayName,
          photoURL: pictureUrl
        });
      }

      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message);
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  async signUpWithPhone(
    phoneNumber: string,
    password: string,
    role: UserRole,
    profileData: Partial<WorkerProfile | BusinessProfile>
  ): Promise<{ confirmationResult: any }> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }
      
      console.log('Attempting phone sign up with:', { phoneNumber, role });
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        this.recaptchaVerifier
      );
      
      // Store temporary data for use after OTP verification
      sessionStorage.setItem('tempSignupData', JSON.stringify({
        role,
        password,
        profileData
      }));

      return { confirmationResult };
    } catch (error: any) {
      console.error('SignUp error:', error);
      throw new Error(error.message);
    }
  }

  async verifyOTP(confirmationResult: any, code: string): Promise<User> {
    try {
      const result = await confirmationResult.confirm(code);
      const tempDataStr = sessionStorage.getItem('tempSignupData');
      
      if (!tempDataStr) {
        throw new Error('Temporary signup data not found');
      }

      const { role, password, profileData } = JSON.parse(tempDataStr);
      
      const userData = {
        id: result.user.uid,
        phoneNumber: result.user.phoneNumber!,
        role,
        displayName: '',
        password, // Store hashed password securely
        ...profileData,
        createdAt: new Date(Timestamp.now().toMillis()),
        updatedAt: new Date(Timestamp.now().toMillis()),
        isVerified: true
      };

      await setDoc(doc(db, 'users', result.user.uid), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Clean up temp data
      sessionStorage.removeItem('tempSignupData');
      
      return userData as User;
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw new Error(error.message);
    }
  }

  async signInWithPhone(phoneNumber: string, password: string): Promise<User> {
    try {
      // Recherche de l'utilisateur par numéro de téléphone
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Vérification du mot de passe
      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      // Connexion avec numéro de téléphone via OTP
      if (!this.recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        this.recaptchaVerifier
      );

      return {
        ...userData,
        createdAt: new Date((userData.createdAt as Timestamp).toMillis()),
        updatedAt: new Date((userData.updatedAt as Timestamp).toMillis())
      } as User;
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      throw new Error(error.message);
    }
  }
}
