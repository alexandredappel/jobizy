import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type UserRole = 'worker' | 'business';

interface BaseSignUpData {
  email: string;
  password: string;
}

interface WorkerSignUpData extends BaseSignUpData {
  role: 'worker';
  phoneNumber: string;
  firstName?: string;
}

interface BusinessSignUpData extends BaseSignUpData {
  role: 'business';
  company_name?: string;
}

export type SignUpData = WorkerSignUpData | BusinessSignUpData;

export interface User extends Omit<FirebaseUser, 'metadata'> {
  id: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  
  // Worker specific fields
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female';
  job?: string;
  languages?: string[];
  workAreas?: string[];
  availability_status?: boolean;
  aboutMe?: string;
  birthday_date?: Timestamp;
  profile_picture_url?: string;
  
  // Business specific fields
  company_name?: string;
  business_type?: 'restaurant' | 'hotel' | 'property_management' | 'guest_house' | 'club';
  location?: string;
  aboutBusiness?: string;
  logo_picture_url?: string;
  website?: string;
}

export interface StoredUser extends User {
  hashedPassword: string;
  failedAttempts: number;
  lastFailedAttempt?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  USER_LOCKED: 'Account temporarily locked',
  OPERATION_NOT_ALLOWED: 'Operation not allowed',
  WEAK_PASSWORD: 'Password is too weak'
} as const;

export type AuthErrorType = typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS];