import { AuthError } from '@/types/auth';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Basic phone number validation for Indonesia
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phoneNumber);
};

export const handleFirebaseError = (error: any): AuthError => {
  const errorCode = error.code || 'auth/unknown';
  let message = 'An unknown error occurred';

  switch (errorCode) {
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email';
      break;
    case 'auth/wrong-password':
      message = 'Invalid password';
      break;
    case 'auth/email-already-in-use':
      message = 'Email already in use';
      break;
    case 'auth/invalid-phone-number':
      message = 'Invalid phone number';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later';
      break;
    case 'auth/operation-not-allowed':
      message = 'Operation not allowed';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      break;
  }

  return new AuthError(message, errorCode);
};