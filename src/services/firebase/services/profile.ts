import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WorkExperience, Education } from '@/types/database.types';

export class ProfileService {
  private workExperienceCollection = collection(db, 'work_experiences');
  private educationCollection = collection(db, 'education');

  // Work Experience Methods
  async addWorkExperience(data: Omit<WorkExperience, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkExperience> {
    try {
      const timestamp = Timestamp.now();
      const docRef = await addDoc(this.workExperienceCollection, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      return {
        id: docRef.id,
        ...data,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate()
      };
    } catch (error: any) {
      console.error('Add work experience error:', error);
      throw new Error(error.message);
    }
  }

  async updateWorkExperience(id: string, data: Partial<WorkExperience>): Promise<void> {
    try {
      const docRef = doc(this.workExperienceCollection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Update work experience error:', error);
      throw new Error(error.message);
    }
  }

  async deleteWorkExperience(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.workExperienceCollection, id));
    } catch (error: any) {
      console.error('Delete work experience error:', error);
      throw new Error(error.message);
    }
  }

  async getUserWorkExperience(userId: string): Promise<WorkExperience[]> {
    try {
      const q = query(this.workExperienceCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as WorkExperience[];
    } catch (error: any) {
      console.error('Get user work experience error:', error);
      throw new Error(error.message);
    }
  }

  // Education Methods
  async addEducation(data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    try {
      const timestamp = Timestamp.now();
      const docRef = await addDoc(this.educationCollection, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      return {
        id: docRef.id,
        ...data,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate()
      };
    } catch (error: any) {
      console.error('Add education error:', error);
      throw new Error(error.message);
    }
  }

  async updateEducation(id: string, data: Partial<Education>): Promise<void> {
    try {
      const docRef = doc(this.educationCollection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Update education error:', error);
      throw new Error(error.message);
    }
  }

  async deleteEducation(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.educationCollection, id));
    } catch (error: any) {
      console.error('Delete education error:', error);
      throw new Error(error.message);
    }
  }

  async getUserEducation(userId: string): Promise<Education[]> {
    try {
      const q = query(this.educationCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Education[];
    } catch (error: any) {
      console.error('Get user education error:', error);
      throw new Error(error.message);
    }
  }

  calculateProfileCompleteness(user: User): number {
    const requiredFields = ['displayName', 'email', 'photoURL'];
    const workerFields = ['skills', 'languages', 'location', 'hourlyRate', 'bio'];
    const businessFields = ['companyName', 'industry', 'location', 'description'];
    
    const fieldsToCheck = [
      ...requiredFields,
      ...(user.role === 'worker' ? workerFields : businessFields)
    ];
    
    const completedFields = fieldsToCheck.filter(field => 
      user[field as keyof User] !== undefined && 
      user[field as keyof User] !== null && 
      user[field as keyof User] !== ''
    );
    
    return Math.round((completedFields.length / fieldsToCheck.length) * 100);
  }
}