import { User, SignUpData } from "@/types/auth";

export interface IAuthService {
  signUp(data: SignUpData): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}