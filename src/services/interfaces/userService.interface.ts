import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProfile } from "@/types/database.types";

export interface IUserService {
  getUserProfile(id: string): Promise<UserProfile>;
  updateProfile(id: string, data: Partial<UserProfile>): Promise<void>;
  updateAvailability(userId: string, status: boolean): Promise<void>;
  updateWorkAreas(userId: string, areas: string[]): Promise<void>;
  updateLanguages(userId: string, languages: string[]): Promise<void>;
  updateProfilePicture(userId: string, url: string): Promise<void>;
  deleteProfile(userId: string): Promise<void>;
}

export class FirebaseUserService implements IUserService {
  async getUserProfile(id: string): Promise<UserProfile> {
    console.log('FirebaseUserService: Getting user profile', id);
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('User not found');
    }
    
    return docSnap.data() as UserProfile;
  }

  async updateProfile(id: string, data: Partial<UserProfile>): Promise<void> {
    console.log('FirebaseUserService: Updating profile', { id, data });
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
  }

  async updateAvailability(userId: string, status: boolean): Promise<void> {
    console.log('FirebaseUserService: Updating availability', { userId, status });
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      availability_status: status,
      updatedAt: new Date()
    });
  }

  async updateWorkAreas(userId: string, areas: string[]): Promise<void> {
    console.log('FirebaseUserService: Updating work areas', { userId, areas });
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      workAreas: areas,
      updatedAt: new Date()
    });
  }

  async updateLanguages(userId: string, languages: string[]): Promise<void> {
    console.log('FirebaseUserService: Updating languages', { userId, languages });
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      languages: languages,
      updatedAt: new Date()
    });
  }

  async updateProfilePicture(userId: string, url: string): Promise<void> {
    console.log('FirebaseUserService: Updating profile picture', { userId, url });
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profile_picture_url: url,
      updatedAt: new Date()
    });
  }

  async deleteProfile(userId: string): Promise<void> {
    console.log('FirebaseUserService: Deleting profile', userId);
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  }
}