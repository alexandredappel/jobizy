import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config';

const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

interface LockoutData {
  failedAttempts: number;
  lastFailedAttempt: Timestamp;
}

export const checkLockout = async (userId: string): Promise<boolean> => {
  const lockoutRef = doc(db, 'lockouts', userId);
  const lockoutDoc = await getDoc(lockoutRef);
  
  if (!lockoutDoc.exists()) return false;
  
  const data = lockoutDoc.data() as LockoutData;
  const now = Timestamp.now();
  
  if (data.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    const timeDiff = now.toMillis() - data.lastFailedAttempt.toMillis();
    if (timeDiff < LOCKOUT_DURATION) {
      return true;
    }
    // Reset after lockout period
    await resetFailedAttempts(userId);
  }
  
  return false;
};

export const incrementFailedAttempts = async (userId: string): Promise<void> => {
  const lockoutRef = doc(db, 'lockouts', userId);
  const lockoutDoc = await getDoc(lockoutRef);
  
  const currentData = lockoutDoc.exists() ? lockoutDoc.data() as LockoutData : { failedAttempts: 0 };
  
  await setDoc(lockoutRef, {
    failedAttempts: currentData.failedAttempts + 1,
    lastFailedAttempt: Timestamp.now()
  });
};

export const resetFailedAttempts = async (userId: string): Promise<void> => {
  const lockoutRef = doc(db, 'lockouts', userId);
  await setDoc(lockoutRef, {
    failedAttempts: 0,
    lastFailedAttempt: Timestamp.now()
  });
};