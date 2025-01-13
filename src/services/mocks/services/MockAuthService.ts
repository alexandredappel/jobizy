import { IAuthService } from "@/services/interfaces/authService.interface";
import { User, SignUpData, AuthError, StoredUser } from "@/types/auth";
import { simulateDelay, simulateNetworkError } from "../utils/mockUtils";

const STORAGE_KEY = 'jobizy_mock_auth_user';
const MOCK_USERS_KEY = 'jobizy_mock_users';
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 1000; // 1 second

export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  private persistSession: boolean = false;

  constructor() {
    console.log('MockAuthService: Initializing');
    if (this.persistSession) {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.notifyListeners();
      }
    }
  }

  private getStoredUsers(): StoredUser[] {
    const users = localStorage.getItem(MOCK_USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private setStoredUsers(users: StoredUser[]): void {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  private hashPassword(password: string): string {
    // Simple hash simulation - DO NOT use in production
    return btoa(password);
  }

  private validatePassword(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  }

  private async checkLockout(user: StoredUser): Promise<void> {
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      const now = Date.now();
      if (user.lastFailedAttempt && (now - user.lastFailedAttempt) < LOCKOUT_DURATION) {
        throw new AuthError('Too many failed attempts. Please try again later.', 'auth/too-many-requests');
      }
      // Reset attempts after lockout period
      user.failedAttempts = 0;
    }
  }

  async signUp(data: SignUpData): Promise<User> {
    console.log('MockAuthService: Signing up user', data);
    await simulateDelay();
    simulateNetworkError();

    if (!this.validatePassword(data.password)) {
      throw new AuthError('Password does not meet requirements', 'auth/weak-password');
    }

    const users = this.getStoredUsers();
    
    if (users.some(u => u.email === data.email)) {
      console.error('MockAuthService: Email already in use');
      throw new AuthError('Email already in use', 'auth/email-already-in-use');
    }

    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };

    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      role: data.role,
      hashedPassword: this.hashPassword(data.password),
      failedAttempts: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    users.push(newUser);
    this.setStoredUsers(users);
    
    const { hashedPassword, failedAttempts, lastFailedAttempt, ...publicUser } = newUser;
    this.currentUser = publicUser;
    
    if (this.persistSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(publicUser));
    }
    this.notifyListeners();

    console.log('MockAuthService: User signed up successfully', publicUser);
    return publicUser;
  }

  async signIn(email: string, password: string): Promise<User> {
    console.log('MockAuthService: Signing in user', email);
    await simulateDelay();
    simulateNetworkError();

    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      console.error('MockAuthService: User not found');
      throw new AuthError('Invalid email or password', 'auth/user-not-found');
    }

    await this.checkLockout(user);

    if (this.hashPassword(password) !== user.hashedPassword) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      user.lastFailedAttempt = Date.now();
      this.setStoredUsers(users);
      
      console.error('MockAuthService: Invalid password');
      throw new AuthError('Invalid email or password', 'auth/wrong-password');
    }

    // Reset failed attempts on successful login
    user.failedAttempts = 0;
    user.lastFailedAttempt = undefined;
    this.setStoredUsers(users);

    const { hashedPassword, failedAttempts, lastFailedAttempt, ...publicUser } = user;
    this.currentUser = publicUser;
    
    if (this.persistSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(publicUser));
    }
    this.notifyListeners();

    console.log('MockAuthService: User signed in successfully', publicUser);
    return publicUser;
  }

  async signOut(): Promise<void> {
    console.log('MockAuthService: Signing out user');
    await simulateDelay();
    simulateNetworkError();

    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();

    console.log('MockAuthService: User signed out successfully');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setPersistence(persist: boolean): void {
    this.persistSession = persist;
    if (!persist) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
}