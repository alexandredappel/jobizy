import { Education } from "@/types/database.types";

export interface IEducationService {
  getEducation(userId: string): Promise<Education[]>;
  addEducation(education: Omit<Education, "id">): Promise<Education>;
  updateEducation(id: string, education: Partial<Education>): Promise<void>;
  deleteEducation(id: string): Promise<void>;
  // ... autres méthodes à venir selon vos besoins
}