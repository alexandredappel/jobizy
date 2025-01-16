import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config';

const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface LockoutData {
  failedAttempts: number;
  lastFailedAttempt: Timestamp;
}

interface CachedLockoutData extends LockoutData {
  cachedAt: number;
}

const lockoutCache = new Map<string, CachedLockoutData>();

export const checkLockout = async (userId: string): Promise<boolean> => {
  const cached = lockoutCache.get(userId);
  if (cached && Date.now() - cached.cachedAt < CACHE_DURATION) {
    if (cached.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      const timeDiff = Date.now() - cached.lastFailedAttempt.toMillis();
      return timeDiff < LOCKOUT_DURATION;
    }
    return false;
  }

  const lockoutRef = doc(db, 'lockouts', userId);
  const lockoutDoc = await getDoc(lockoutRef);
  
  if (!lockoutDoc.exists()) return false;
  
  const data = lockoutDoc.data() as LockoutData;
  
  if (data.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    const now = Timestamp.now();
    const timeDiff = now.toMillis() - data.lastFailedAttempt.toMillis();
    if (timeDiff < LOCKOUT_DURATION) {
      lockoutCache.set(userId, { ...data, cachedAt: Date.now() });
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
  
  const newData = {
    failedAttempts: currentData.failedAttempts + 1,
    lastFailedAttempt: Timestamp.now()
  };

  await setDoc(lockoutRef, newData);
  lockoutCache.set(userId, { ...newData, cachedAt: Date.now() });
};

export const resetFailedAttempts = async (userId: string): Promise<void> => {
  const lockoutRef = doc(db, 'lockouts', userId);
  const newData = {
    failedAttempts: 0,
    lastFailedAttempt: Timestamp.now()
  };
  
  await setDoc(lockoutRef, newData);
  lockoutCache.set(userId, { ...newData, cachedAt: Date.now() });
};