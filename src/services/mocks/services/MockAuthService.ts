import { IAuthService } from "@/services/interfaces/authService.interface";
import { User, SignUpData, AuthError } from "@/types/auth";
import { simulateDelay, simulateNetworkError } from "../utils/mockUtils";

const STORAGE_KEY = 'jobizy_mock_auth_user';
const MOCK_USERS_KEY = 'jobizy_mock_users';

export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Initialize current user from localStorage
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.notifyListeners();
    }
  }

  private getStoredUsers(): User[] {
    const users = localStorage.getItem(MOCK_USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private setStoredUsers(users: User[]): void {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async signUp(data: SignUpData): Promise<User> {
    console.log('MockAuthService: Signing up user', data);
    await simulateDelay();
    simulateNetworkError();

    const users = this.getStoredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === data.email)) {
      console.error('MockAuthService: Email already in use');
      throw new AuthError('Email already in use', 'auth/email-already-in-use');
    }

    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      role: data.role,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    users.push(newUser);
    this.setStoredUsers(users);
    
    // Set as current user
    this.currentUser = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    this.notifyListeners();

    console.log('MockAuthService: User signed up successfully', newUser);
    return newUser;
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

    // Set as current user
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.notifyListeners();

    console.log('MockAuthService: User signed in successfully', user);
    return user;
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

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return cleanup function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
}