import { IMessageService } from '@/services/interfaces/messageService.interface';
import { Message } from '@/types/database.types';
import { mockMessages } from '../data/mockData';
import { simulateDelay, simulateNetworkError } from '../utils/mockUtils';

export class MockMessageService implements IMessageService {
  async getMessages(conversationId: string): Promise<Message[]> {
    console.log('MockMessageService: Getting messages for conversation', conversationId);
    await simulateDelay();
    simulateNetworkError();

    const messages = mockMessages.filter(msg => msg.conversationId === conversationId);
    console.log('MockMessageService: Found messages:', messages.length);

    // Return a deep copy to prevent direct modifications
    return [...messages].sort((a, b) => 
      (b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000) - 
      (a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000)
    );
  }

  async sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
    console.log('MockMessageService: Sending message', { conversationId, message });
    await simulateDelay();
    simulateNetworkError();

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      },
      ...message
    };

    mockMessages.push(newMessage);
    console.log('MockMessageService: Message sent successfully', newMessage.id);

    return newMessage.id;
  }

  async markAsRead(messageId: string): Promise<void> {
    console.log('MockMessageService: Marking message as read', messageId);
    await simulateDelay();
    simulateNetworkError();

    const message = mockMessages.find(msg => msg.id === messageId);
    if (!message) {
      console.error('MockMessageService: Message not found', messageId);
      throw new Error('Message not found');
    }

    message.isRead = true;
    message.readAt = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };
    console.log('MockMessageService: Message marked as read', messageId);
  }

  async deleteMessage(messageId: string): Promise<void> {
    console.log('MockMessageService: Deleting message', messageId);
    await simulateDelay();
    simulateNetworkError();

    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      console.error('MockMessageService: Message not found', messageId);
      throw new Error('Message not found');
    }

    mockMessages.splice(messageIndex, 1);
    console.log('MockMessageService: Message deleted successfully', messageId);
  }
}