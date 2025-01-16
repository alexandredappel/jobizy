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
import { Education } from '@/types/database.types';

export class EducationService {
  private collection = collection(db, 'education');

  async create(data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    console.log('EducationService: Creating education record', data);
    const timestamp = Timestamp.now();
    const docRef = await addDoc(this.collection, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    console.log('EducationService: Education record created', { id: docRef.id });
    return {
      id: docRef.id,
      ...data,
      createdAt: timestamp.toDate(),
      updatedAt: timestamp.toDate()
    };
  }

  async update(id: string, data: Partial<Omit<Education, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    console.log('EducationService: Updating education record', { id, data });
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    console.log('EducationService: Education record updated', { id });
  }

  async delete(id: string): Promise<void> {
    console.log('EducationService: Deleting education record', { id });
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
    console.log('EducationService: Education record deleted', { id });
  }

  async getAllForUser(userId: string): Promise<Education[]> {
    console.log('EducationService: Getting all education records for user', { userId });
    const q = query(this.collection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const education = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Education));
    
    console.log('EducationService: Found education records', { 
      userId, 
      count: education.length 
    });
    
    return education;
  }
}