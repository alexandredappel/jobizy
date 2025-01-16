import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Education } from "@/types/database.types";

export interface IEducationService {
  getEducation(userId: string): Promise<Education[]>;
  addEducation(userId: string, education: Omit<Education, 'id'>): Promise<string>;
  updateEducation(educationId: string, data: Partial<Education>): Promise<void>;
  deleteEducation(educationId: string): Promise<void>;
}

export class FirebaseEducationService implements IEducationService {
  async getEducation(userId: string): Promise<Education[]> {
    console.log('FirebaseEducationService: Getting education for user', userId);
    const q = query(
      collection(db, 'education'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Education));
  }

  async addEducation(userId: string, education: Omit<Education, 'id'>): Promise<string> {
    console.log('FirebaseEducationService: Adding education', { userId, education });
    const educationRef = await addDoc(collection(db, 'education'), {
      ...education,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return educationRef.id;
  }

  async updateEducation(educationId: string, data: Partial<Education>): Promise<void> {
    console.log('FirebaseEducationService: Updating education', { educationId, data });
    const educationRef = doc(db, 'education', educationId);
    await updateDoc(educationRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async deleteEducation(educationId: string): Promise<void> {
    console.log('FirebaseEducationService: Deleting education', educationId);
    const educationRef = doc(db, 'education', educationId);
    await deleteDoc(educationRef);
  }
}