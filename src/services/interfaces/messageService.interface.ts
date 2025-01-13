import { Message } from "@/types/database.types";

export interface IMessageService {
  sendMessage(conversationId: string, content: string): Promise<Message>;
  getMessages(conversationId: string): Promise<Message[]>;
  // ... autres méthodes à venir selon vos besoins
}