import { Conversation, LastMessage } from "@/types/database.types";

export interface IConversationService {
  getConversations(userId: string): Promise<Conversation[]>;
  createConversation(participants: string[]): Promise<string>;
  updateLastMessage(conversationId: string, message: LastMessage): Promise<void>;
  toggleFavorite(conversationId: string, userId: string, isFavorite: boolean): Promise<void>;
  deleteConversation(conversationId: string): Promise<void>;
}