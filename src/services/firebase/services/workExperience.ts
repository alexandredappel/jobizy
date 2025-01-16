import { db } from '../config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { WorkExperience } from '@/types/database.types';

export class WorkExperienceService {
  private collection = collection(db, 'work_experiences');

  async create(data: Omit<WorkExperience, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkExperience> {
    console.log('WorkExperienceService: Creating work experience', data);
    const timestamp = Timestamp.now();
    const docRef = await addDoc(this.collection, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    console.log('WorkExperienceService: Work experience created', { id: docRef.id });
    return {
      id: docRef.id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
  }

  async update(id: string, data: Partial<Omit<WorkExperience, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    console.log('WorkExperienceService: Updating work experience', { id, data });
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    console.log('WorkExperienceService: Work experience updated', { id });
  }

  async delete(id: string): Promise<void> {
    console.log('WorkExperienceService: Deleting work experience', { id });
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
    console.log('WorkExperienceService: Work experience deleted', { id });
  }

  async getAllForUser(userId: string): Promise<WorkExperience[]> {
    console.log('WorkExperienceService: Getting all work experiences for user', { userId });
    const q = query(this.collection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const experiences = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WorkExperience));
    
    console.log('WorkExperienceService: Found work experiences', { 
      userId, 
      count: experiences.length 
    });
    
    return experiences;
  }
}