import { Timestamp } from "./database.types";

export type UserRole = 'worker' | 'business';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SignUpData {
  email: string;
  password: string;
  role: UserRole;
}

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}