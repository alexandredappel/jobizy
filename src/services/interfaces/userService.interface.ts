import { UserProfile } from "@/types/database.types";

export interface IUserService {
  getUserProfile(id: string): Promise<UserProfile>;
  updateProfile(id: string, data: Partial<UserProfile>): Promise<void>;
  updateAvailability(userId: string, status: boolean): Promise<void>;
  updateWorkAreas(userId: string, areas: string[]): Promise<void>;
  updateLanguages(userId: string, languages: string[]): Promise<void>;
  updateProfilePicture(userId: string, url: string): Promise<void>;
  deleteProfile(userId: string): Promise<void>;
}