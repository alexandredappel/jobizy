import { Education } from "@/types/database.types";

export interface IEducationService {
  getEducation(userId: string): Promise<Education[]>;
  addEducation(userId: string, education: Omit<Education, 'id'>): Promise<string>;
  updateEducation(educationId: string, data: Partial<Education>): Promise<void>;
  deleteEducation(educationId: string): Promise<void>;
}