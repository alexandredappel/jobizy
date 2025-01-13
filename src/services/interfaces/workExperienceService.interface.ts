import { WorkExperience } from "@/types/database.types";

export interface IWorkExperienceService {
  getWorkExperiences(userId: string): Promise<WorkExperience[]>;
  addWorkExperience(experience: Omit<WorkExperience, "id">): Promise<WorkExperience>;
  updateWorkExperience(id: string, experience: Partial<WorkExperience>): Promise<void>;
  deleteWorkExperience(id: string): Promise<void>;
  // ... autres méthodes à venir selon vos besoins
}