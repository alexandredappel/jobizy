import { 
  doc, 
  getDoc, 
  updateDoc, 
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { 
  User, 
  WorkerProfile, 
  BusinessProfile, 
  JobType, 
  Language, 
  WorkArea 
} from '@/types/database.types';

export class UserService {
  private collection = collection(db, 'users');

  async getById(id: string): Promise<User | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return docSnap.data() as User;
    } catch (error: any) {
      console.error('Get user error:', error);
      throw new Error(error.message);
    }
  }

  async updateProfile(id: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message);
    }
  }

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `profile-pictures/${userId}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await this.updateProfile(userId, { 
        profile_picture_url: downloadURL 
      });
      
      return downloadURL;
    } catch (error: any) {
      console.error('Upload profile picture error:', error);
      throw new Error(error.message);
    }
  }

  async searchWorkers(filters: {
    job?: JobType;
    languages?: Language[];
    workAreas?: WorkArea[];
    availability_status?: boolean;
  }): Promise<WorkerProfile[]> {
    try {
      let q = query(
        this.collection,
        where('role', '==', 'worker')
      );

      if (filters.availability_status !== undefined) {
        q = query(q, where('availability_status', '==', filters.availability_status));
      }

      if (filters.workAreas?.length === 1) {
        q = query(q, where('workAreas', 'array-contains', filters.workAreas[0]));
      }

      const querySnapshot = await getDocs(q);
      const workers = querySnapshot.docs
        .map(doc => doc.data() as WorkerProfile)
        .filter(worker => {
          if (filters.job) {
            return worker.job === filters.job;
          }
          if (filters.languages?.length) {
            return filters.languages.some(lang => worker.languages.includes(lang));
          }
          if (filters.workAreas && filters.workAreas.length > 1) {
            return filters.workAreas.some(area => worker.workAreas.includes(area));
          }
          return true;
        });

      return workers;
    } catch (error: any) {
      console.error('Search workers error:', error);
      throw new Error(error.message);
    }
  }

  async getBusinessProfile(id: string): Promise<BusinessProfile | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || docSnap.data().role !== 'business') {
        return null;
      }

      return docSnap.data() as BusinessProfile;
    } catch (error: any) {
      console.error('Get business profile error:', error);
      throw new Error(error.message);
    }
  }
}