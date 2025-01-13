import { Conversation } from "@/types/database.types";

export interface IConversationService {
  getConversations(): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation>;
  createConversation(participantId: string): Promise<Conversation>;
  // ... autres méthodes à venir selon vos besoins
}