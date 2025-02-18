import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User,
  WorkerUser,
  BusinessUser
} from '@/types/firebase.types';

export class ProfileService {
  async getProfile(userId: string): Promise<User | null> {
    try {
      const profileRef = doc(db, 'users', userId);
      const docSnap = await getDoc(profileRef);

      if (docSnap.exists()) {
        return docSnap.data() as User;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<WorkerUser | BusinessUser>): Promise<void> {
    try {
      const profileRef = doc(db, 'users', userId);
      await updateDoc(profileRef, {
        ...data,
        updated_at: Timestamp.now()
      });
      console.log("Profile successfully updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}
