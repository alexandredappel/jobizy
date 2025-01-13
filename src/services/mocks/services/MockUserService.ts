import { IUserService } from '@/services/interfaces/userService.interface';
import { UserProfile } from '@/types/database.types';
import { mockUsers } from '../data/mockData';
import { simulateDelay, simulateNetworkError } from '../utils/mockUtils';

export class MockUserService implements IUserService {
  async getUserProfile(id: string): Promise<UserProfile> {
    console.log('MockUserService: Getting user profile', id);
    await simulateDelay();
    simulateNetworkError();
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async updateProfile(id: string, data: Partial<UserProfile>): Promise<void> {
    console.log('MockUserService: Updating profile', { id, data });
    await simulateDelay();
    simulateNetworkError();

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async updateAvailability(userId: string, status: boolean): Promise<void> {
    console.log('MockUserService: Updating availability', { userId, status });
    await simulateDelay();
    simulateNetworkError();

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (mockUsers[userIndex].role !== 'worker') {
      throw new Error('Only workers can update availability status');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      availability_status: status,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async updateWorkAreas(userId: string, areas: string[]): Promise<void> {
    console.log('MockUserService: Updating work areas', { userId, areas });
    await simulateDelay();
    simulateNetworkError();

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      workAreas: areas,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async updateLanguages(userId: string, languages: string[]): Promise<void> {
    console.log('MockUserService: Updating languages', { userId, languages });
    await simulateDelay();
    simulateNetworkError();

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      languages: languages,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async updateProfilePicture(userId: string, url: string): Promise<void> {
    console.log('MockUserService: Updating profile picture', { userId, url });
    await simulateDelay();
    simulateNetworkError();

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      profile_picture_url: url,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async deleteProfile(userId: string): Promise<void> {
    console.log('MockUserService: Deleting profile', userId);
    await simulateDelay();
    simulateNetworkError();

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(userIndex, 1);
  }
}