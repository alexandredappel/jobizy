import { IAuthService } from "@/services/interfaces/authService.interface";
import { User, SignUpData, AuthError, StoredUser } from "@/types/auth";
import { simulateDelay, simulateNetworkError } from "../utils/mockUtils";
import { hashPassword, verifyPassword } from "../auth/passwordUtils";
import { getStoredUsers, setStoredUsers, getCurrentStoredUser, setCurrentUser, clearStoredUser } from "../auth/storageUtils";
import { validateSignUpData } from "../auth/validationUtils";
import { checkLockout, incrementFailedAttempts, resetFailedAttempts } from "../auth/lockoutManager";

export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  private persistSession: boolean = false;

  constructor() {
    console.log('MockAuthService: Initializing');
    if (this.persistSession) {
      this.currentUser = getCurrentStoredUser();
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async signUp(data: SignUpData): Promise<User> {
    console.log('MockAuthService: Signing up user', data);
    await simulateDelay();
    simulateNetworkError();

    validateSignUpData(data);

    const users = getStoredUsers();
    
    if (users.some(u => u.email === data.email)) {
      console.error('MockAuthService: Email already in use');
      throw new AuthError('Email already in use', 'auth/email-already-in-use');
    }

    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };

    const baseUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      role: data.role,
      hashedPassword: hashPassword(data.password),
      failedAttempts: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Add role-specific fields
    const newUser: StoredUser = data.role === 'worker' 
      ? {
          ...baseUser,
          phoneNumber: data.phoneNumber,
          firstName: data.firstName
        }
      : {
          ...baseUser,
          company_name: data.company_name
        };

    users.push(newUser);
    setStoredUsers(users);
    
    const { hashedPassword, failedAttempts, lastFailedAttempt, ...publicUser } = newUser;
    this.currentUser = publicUser;
    
    if (this.persistSession) {
      setCurrentUser(publicUser, true);
    }
    this.notifyListeners();

    console.log('MockAuthService: User signed up successfully', publicUser);
    return publicUser;
  }

  async signIn(email: string, password: string): Promise<User> {
    console.log('MockAuthService: Signing in user', email);
    await simulateDelay();
    simulateNetworkError();

    const users = getStoredUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      console.error('MockAuthService: User not found');
      throw new AuthError('Invalid email or password', 'auth/user-not-found');
    }

    await checkLockout(user);

    if (!verifyPassword(password, user.hashedPassword)) {
      incrementFailedAttempts(user);
      console.error('MockAuthService: Invalid password');
      throw new AuthError('Invalid email or password', 'auth/wrong-password');
    }

    resetFailedAttempts(user);

    const { hashedPassword, failedAttempts, lastFailedAttempt, ...publicUser } = user;
    this.currentUser = publicUser;
    
    if (this.persistSession) {
      setCurrentUser(publicUser, true);
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
    clearStoredUser();
    this.notifyListeners();

    console.log('MockAuthService: User signed out successfully');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setPersistence(persist: boolean): void {
    this.persistSession = persist;
    if (!persist) {
      clearStoredUser();
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