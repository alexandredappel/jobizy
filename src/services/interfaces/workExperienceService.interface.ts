import { WorkExperience } from "@/types/database.types";

export interface IWorkExperienceService {
  getExperiences(userId: string): Promise<WorkExperience[]>;
  addExperience(userId: string, experience: Omit<WorkExperience, 'id'>): Promise<string>;
  updateExperience(experienceId: string, data: Partial<WorkExperience>): Promise<void>;
  deleteExperience(experienceId: string): Promise<void>;
}