import { IMessageService } from '@/services/interfaces/messageService.interface';
import { Message } from '@/types/database.types';
import { mockMessages } from '../data/mockData';
import { simulateDelay, simulateNetworkError } from '../utils/mockUtils';

export class MockMessageService implements IMessageService {
  async getMessages(conversationId: string): Promise<Message[]> {
    console.log('MockMessageService: Getting messages for conversation', conversationId);
    await simulateDelay();
    simulateNetworkError();

    const messages = mockMessages.find(msg => msg.conversationId === conversationId);
    if (!messages) {
      console.log('MockMessageService: No messages found for conversation', conversationId);
      return [];
    }

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

    const conversationMessages = mockMessages.find(msg => msg.conversationId === conversationId);
    if (!conversationMessages) {
      mockMessages.push(newMessage);
    } else {
      conversationMessages.push(newMessage);
    }

    return newMessage.id;
  }

  async markAsRead(messageId: string): Promise<void> {
    console.log('MockMessageService: Marking message as read', messageId);
    await simulateDelay();
    simulateNetworkError();

    const message = mockMessages.flat().find(msg => msg.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    message.isRead = true;
    message.readAt = {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1000000
    };
  }

  async deleteMessage(messageId: string): Promise<void> {
    console.log('MockMessageService: Deleting message', messageId);
    await simulateDelay();
    simulateNetworkError();

    const messageIndex = mockMessages.flat().findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }

    // Find the conversation that contains this message
    const conversationMessages = mockMessages.find(msgs => 
      msgs.some(msg => msg.id === messageId)
    );

    if (!conversationMessages) {
      throw new Error('Conversation not found');
    }

    // Remove the message from the conversation
    const msgIndex = conversationMessages.findIndex(msg => msg.id === messageId);
    if (msgIndex !== -1) {
      conversationMessages.splice(msgIndex, 1);
    }
  }
}