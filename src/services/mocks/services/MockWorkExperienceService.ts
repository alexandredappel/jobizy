import { IWorkExperienceService } from '@/services/interfaces/workExperienceService.interface';
import { WorkExperience } from '@/types/database.types';
import { mockWorkExperiences } from '../data/mockData';
import { simulateDelay, simulateNetworkError } from '../utils/mockUtils';

export class MockWorkExperienceService implements IWorkExperienceService {
  async getExperiences(userId: string): Promise<WorkExperience[]> {
    console.log('MockWorkExperienceService: Getting experiences for user', userId);
    await simulateDelay();
    simulateNetworkError();

    const experiences = mockWorkExperiences.filter(exp => exp.userId === userId);
    console.log('MockWorkExperienceService: Found experiences:', experiences.length);

    // Return a deep copy sorted by startDate (most recent first)
    return [...experiences].sort((a, b) => 
      (b.startDate.seconds - a.startDate.seconds) || 
      (b.startDate.nanoseconds - a.startDate.nanoseconds)
    );
  }

  async addExperience(
    userId: string, 
    experience: Omit<WorkExperience, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    console.log('MockWorkExperienceService: Adding experience for user', userId, experience);
    await simulateDelay();
    simulateNetworkError();

    // Validate required fields
    if (!experience.companyName || !experience.position || !experience.startDate) {
      console.error('MockWorkExperienceService: Missing required fields');
      throw new Error('Missing required fields');
    }

    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };

    const newExperience: WorkExperience = {
      id: `exp_${Date.now()}`,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...experience
    };

    mockWorkExperiences.push(newExperience);
    console.log('MockWorkExperienceService: Experience added successfully', newExperience.id);

    return newExperience.id;
  }

  async updateWorkExperience(
    experienceId: string, 
    data: Partial<WorkExperience>
  ): Promise<void> {
    console.log('MockWorkExperienceService: Updating experience', experienceId, data);
    await simulateDelay();
    simulateNetworkError();

    const experience = mockWorkExperiences.find(exp => exp.id === experienceId);
    if (!experience) {
      console.error('MockWorkExperienceService: Experience not found', experienceId);
      throw new Error('Experience not found');
    }

    // Remove non-updatable fields
    const { id, userId, createdAt, ...updatableData } = data;

    // Update the experience
    Object.assign(experience, {
      ...updatableData,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    });

    console.log('MockWorkExperienceService: Experience updated successfully', experienceId);
  }

  async deleteWorkExperience(experienceId: string): Promise<void> {
    console.log('MockWorkExperienceService: Deleting experience', experienceId);
    await simulateDelay();
    simulateNetworkError();

    const experienceIndex = mockWorkExperiences.findIndex(exp => exp.id === experienceId);
    if (experienceIndex === -1) {
      console.error('MockWorkExperienceService: Experience not found', experienceId);
      throw new Error('Experience not found');
    }

    mockWorkExperiences.splice(experienceIndex, 1);
    console.log('MockWorkExperienceService: Experience deleted successfully', experienceId);
  }
}