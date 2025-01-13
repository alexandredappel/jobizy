import { StoredUser } from "@/types/auth";
import { AuthError } from "@/types/auth";
import { getStoredUsers, setStoredUsers } from "./storageUtils";

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCKOUT_DURATION = 1000; // 1 second for testing

export const checkLockout = async (user: StoredUser): Promise<void> => {
  if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    const now = Date.now();
    if (user.lastFailedAttempt && (now - user.lastFailedAttempt) < LOCKOUT_DURATION) {
      throw new AuthError('Too many failed attempts. Please try again later.', 'auth/too-many-requests');
    }
    // Reset attempts after lockout period
    resetFailedAttempts(user);
  }
};

export const incrementFailedAttempts = (user: StoredUser): void => {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex !== -1) {
    users[userIndex].failedAttempts = (users[userIndex].failedAttempts || 0) + 1;
    users[userIndex].lastFailedAttempt = Date.now();
    setStoredUsers(users);
  }
};

export const resetFailedAttempts = (user: StoredUser): void => {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex !== -1) {
    users[userIndex].failedAttempts = 0;
    users[userIndex].lastFailedAttempt = undefined;
    setStoredUsers(users);
  }
};