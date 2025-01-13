import { Timestamp } from "./database.types";

// Base types
export type UserRole = 'worker' | 'business';

// Main User interface
export interface User {
  id: string;
  email: string;
  phoneNumber: string;
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

// Authentication related interfaces
export interface StoredUser extends User {
  hashedPassword: string;
  failedAttempts: number;
  lastFailedAttempt?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SignUpData {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  company_name?: string;
}

// Error handling
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Error constants
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  USER_LOCKED: 'Account temporarily locked'
} as const;

export type AuthErrorType = typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS];