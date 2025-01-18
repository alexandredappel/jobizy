export type UserRole = 'worker' | 'business';

export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface WorkerProfile extends BaseUser {
  role: 'worker';
  availability: boolean;
  skills: string[];
  languages: string[];
  location: string;
  experience: number;
  hourlyRate: number;
  bio: string;
}

export interface BusinessProfile extends BaseUser {
  role: 'business';
  companyName: string;
  industry: string;
  location: string;
  website?: string;
  employeeCount: number;
  description: string;
}

export type User = WorkerProfile | BusinessProfile;

export interface WorkExperience {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentJob: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  isCurrentStudy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  favoriteFor: string[];
}