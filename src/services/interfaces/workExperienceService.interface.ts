import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { WorkExperience } from "@/types/database.types";

export interface IWorkExperienceService {
  getExperiences(userId: string): Promise<WorkExperience[]>;
  addExperience(userId: string, experience: Omit<WorkExperience, 'id'>): Promise<string>;
  updateExperience(experienceId: string, data: Partial<WorkExperience>): Promise<void>;
  deleteExperience(experienceId: string): Promise<void>;
}

export class FirebaseWorkExperienceService implements IWorkExperienceService {
  async getExperiences(userId: string): Promise<WorkExperience[]> {
    console.log('FirebaseWorkExperienceService: Getting experiences for user', userId);
    const q = query(
      collection(db, 'workExperiences'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WorkExperience));
  }

  async addExperience(userId: string, experience: Omit<WorkExperience, 'id'>): Promise<string> {
    console.log('FirebaseWorkExperienceService: Adding experience', { userId, experience });
    const experienceRef = await addDoc(collection(db, 'workExperiences'), {
      ...experience,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return experienceRef.id;
  }

  async updateExperience(experienceId: string, data: Partial<WorkExperience>): Promise<void> {
    console.log('FirebaseWorkExperienceService: Updating experience', { experienceId, data });
    const experienceRef = doc(db, 'workExperiences', experienceId);
    await updateDoc(experienceRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async deleteExperience(experienceId: string): Promise<void> {
    console.log('FirebaseWorkExperienceService: Deleting experience', experienceId);
    const experienceRef = doc(db, 'workExperiences', experienceId);
    await deleteDoc(experienceRef);
  }
}