import { IConversationService } from '@/services/interfaces/conversationService.interface';
import { Conversation, LastMessage } from '@/types/database.types';
import { mockConversations } from '../data/mockData';
import { simulateDelay, simulateNetworkError } from '../utils/mockUtils';

export class MockConversationService implements IConversationService {
  async getConversations(userId: string): Promise<Conversation[]> {
    console.log('MockConversationService: Getting conversations for user', userId);
    await simulateDelay();
    simulateNetworkError();

    return mockConversations
      .filter(conv => conv.participants.includes(userId))
      .map(conv => ({ ...conv }));
  }

  async createConversation(participants: string[]): Promise<string> {
    console.log('MockConversationService: Creating conversation', { participants });
    await simulateDelay();
    simulateNetworkError();

    if (participants.length < 2) {
      throw new Error('Conversation must have at least 2 participants');
    }

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participants,
      lastMessage: {
        content: '',
        timestamp: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0
        },
        senderId: participants[0]
      },
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      },
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };

    mockConversations.push(newConversation);
    return newConversation.id;
  }

  async updateLastMessage(conversationId: string, message: LastMessage): Promise<void> {
    console.log('MockConversationService: Updating last message', { conversationId, message });
    await simulateDelay();
    simulateNetworkError();

    const conversationIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) {
      throw new Error('Conversation not found');
    }

    mockConversations[conversationIndex] = {
      ...mockConversations[conversationIndex],
      lastMessage: message,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async toggleFavorite(conversationId: string, userId: string, isFavorite: boolean): Promise<void> {
    console.log('MockConversationService: Toggling favorite', { conversationId, userId, isFavorite });
    await simulateDelay();
    simulateNetworkError();

    const conversationIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) {
      throw new Error('Conversation not found');
    }

    const conversation = mockConversations[conversationIndex];
    if (!conversation.participants.includes(userId)) {
      throw new Error('User is not a participant in this conversation');
    }

    mockConversations[conversationIndex] = {
      ...conversation,
      isFavorite: {
        ...conversation.isFavorite,
        [userId]: isFavorite
      },
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
  }

  async deleteConversation(conversationId: string): Promise<void> {
    console.log('MockConversationService: Deleting conversation', conversationId);
    await simulateDelay();
    simulateNetworkError();

    const conversationIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) {
      throw new Error('Conversation not found');
    }

    mockConversations.splice(conversationIndex, 1);
  }
}