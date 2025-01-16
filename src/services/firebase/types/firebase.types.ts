import { Timestamp, DocumentReference } from 'firebase/firestore';
import { UserProfile, Message, Conversation, WorkExperience, Education } from '@/types/database.types';
import { User, UserRole } from '@/types/auth';

export interface FirebaseUserProfile extends Omit<UserProfile, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseMessage extends Omit<Message, 'timestamp' | 'readAt'> {
  timestamp: Timestamp;
  readAt?: Timestamp;
}

export interface FirebaseConversation extends Omit<Conversation, 'createdAt' | 'updatedAt' | 'lastMessage'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage: {
    content: string;
    timestamp: Timestamp;
    senderId: string;
  };
}

export interface FirebaseWorkExperience extends Omit<WorkExperience, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> {
  startDate: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseEducation extends Omit<Education, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> {
  startDate: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  role: UserRole;
  disabled: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}