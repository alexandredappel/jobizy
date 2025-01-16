import { db } from '../config';
import { doc, collection, getDoc, getDocs, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { User } from '@/types/auth';

export class UserService {
  private collection = collection(db, 'users');

  async getById(id: string): Promise<User | null> {
    console.log('UserService: Getting user by ID', { userId: id });
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('UserService: User not found', { userId: id });
      return null;
    }
    
    console.log('UserService: User found', { userId: id });
    return docSnap.data() as User;
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    console.log('UserService: Updating user', { userId: id, data });
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, { 
      ...data, 
      updatedAt: Timestamp.now() 
    });
    console.log('UserService: User updated successfully', { userId: id });
  }

  async searchWorkers(filters: {
    job?: string;
    workAreas?: string[];
    languages?: string[];
    gender?: 'male' | 'female';
  }): Promise<User[]> {
    console.log('UserService: Searching workers with filters', filters);
    let q = query(this.collection, where('role', '==', 'worker'));

    if (filters.job) {
      q = query(q, where('job', '==', filters.job));
    }
    if (filters.gender) {
      q = query(q, where('gender', '==', filters.gender));
    }
    // Note: Firebase doesn't support OR queries directly for arrays
    // This is a simplified implementation

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));

    // Client-side filtering for arrays
    return users.filter(user => {
      const matchesWorkAreas = !filters.workAreas?.length || 
        filters.workAreas.some(area => user.workAreas?.includes(area));
      const matchesLanguages = !filters.languages?.length || 
        filters.languages.some(lang => user.languages?.includes(lang));
      return matchesWorkAreas && matchesLanguages;
    });
  }
}