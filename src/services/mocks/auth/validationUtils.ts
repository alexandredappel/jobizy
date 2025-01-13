import { SignUpData } from "@/types/auth";
import { validatePassword } from "./passwordUtils";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validateSignUpData = (data: SignUpData): void => {
  if (!validateEmail(data.email)) {
    throw new Error('Invalid email format');
  }
  
  if (!validatePassword(data.password)) {
    throw new Error('Password does not meet requirements');
  }
  
  if (!['worker', 'business'].includes(data.role)) {
    throw new Error('Invalid user role');
  }
};