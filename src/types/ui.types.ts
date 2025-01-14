import type { Message as DBMessage } from './database.types';

// UI-specific version of the Message type
export type Message = Omit<DBMessage, 'conversationId' | 'senderId' | 'isRead' | 'readAt'> & {
  isSent: boolean;  // For UI display purposes
};