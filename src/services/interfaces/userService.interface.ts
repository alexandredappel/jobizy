import { UserProfile } from "@/types/database.types";

export interface IUserService {
  getCurrentUser(): Promise<UserProfile | null>;
  getUserById(id: string): Promise<UserProfile>;
  updateUserProfile(profile: Partial<UserProfile>): Promise<void>;
  // ... autres méthodes à venir selon vos besoins
}