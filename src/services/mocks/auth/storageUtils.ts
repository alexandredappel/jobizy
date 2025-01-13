import { StoredUser, User } from "@/types/auth";

const STORAGE_KEY = 'jobizy_mock_auth_user';
const MOCK_USERS_KEY = 'jobizy_mock_users';

export const getStoredUsers = (): StoredUser[] => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const setStoredUsers = (users: StoredUser[]): void => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const getCurrentStoredUser = (): User | null => {
  const storedUser = localStorage.getItem(STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

export const setCurrentUser = (user: User | null, persist: boolean = false): void => {
  if (user && persist) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const clearStoredUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};