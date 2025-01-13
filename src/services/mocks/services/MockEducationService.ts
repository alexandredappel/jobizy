import { IEducationService } from '@/services/interfaces/educationService.interface';
import { Education } from '@/types/database.types';
import { mockEducation } from '../data/mockData';
import { simulateDelay, simulateNetworkError } from '../utils/mockUtils';

export class MockEducationService implements IEducationService {
  async getEducation(userId: string): Promise<Education[]> {
    console.log('MockEducationService: Getting education for user', userId);
    await simulateDelay();
    simulateNetworkError();

    const education = mockEducation.filter(edu => edu.userId === userId);
    console.log('MockEducationService: Found education entries:', education.length);

    // Return a deep copy sorted by startDate (most recent first)
    return [...education].sort((a, b) => 
      (b.startDate.seconds - a.startDate.seconds) || 
      (b.startDate.nanoseconds - a.startDate.nanoseconds)
    );
  }

  async addEducation(
    userId: string, 
    education: Omit<Education, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    console.log('MockEducationService: Adding education for user', userId, education);
    await simulateDelay();
    simulateNetworkError();

    // Validate required fields
    if (!education.institutionName || !education.degree || !education.startDate) {
      console.error('MockEducationService: Missing required fields');
      throw new Error('Missing required fields');
    }

    const timestamp = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };

    const newEducation: Education = {
      id: `edu_${Date.now()}`,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...education
    };

    mockEducation.push(newEducation);
    console.log('MockEducationService: Education added successfully', newEducation.id);

    return newEducation.id;
  }

  async updateEducation(
    educationId: string, 
    data: Partial<Education>
  ): Promise<void> {
    console.log('MockEducationService: Updating education', educationId, data);
    await simulateDelay();
    simulateNetworkError();

    const education = mockEducation.find(edu => edu.id === educationId);
    if (!education) {
      console.error('MockEducationService: Education not found', educationId);
      throw new Error('Education not found');
    }

    // Remove non-updatable fields
    const { id, userId, createdAt, ...updatableData } = data;

    // Update the education entry
    Object.assign(education, {
      ...updatableData,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    });

    console.log('MockEducationService: Education updated successfully', educationId);
  }

  async deleteEducation(educationId: string): Promise<void> {
    console.log('MockEducationService: Deleting education', educationId);
    await simulateDelay();
    simulateNetworkError();

    const educationIndex = mockEducation.findIndex(edu => edu.id === educationId);
    if (educationIndex === -1) {
      console.error('MockEducationService: Education not found', educationId);
      throw new Error('Education not found');
    }

    mockEducation.splice(educationIndex, 1);
    console.log('MockEducationService: Education deleted successfully', educationId);
  }
}