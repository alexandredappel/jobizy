import { Message } from "@/types/database.types";

export interface IMessageService {
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string>;
  markAsRead(messageId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
}