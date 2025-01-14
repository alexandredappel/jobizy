import type { Message as DBMessage } from './database.types';

// UI-specific version of the Message type
export type Message = {
  id: string;
  content: string;
  timestamp: Date;
  isSent: boolean;
};

// Utility function to convert DB message to UI message
export const dbMessageToUiMessage = (dbMessage: DBMessage, currentUserId: string): Message => {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    timestamp: new Date(dbMessage.timestamp.seconds * 1000 + dbMessage.timestamp.nanoseconds / 1000000),
    isSent: dbMessage.senderId === currentUserId
  };
};