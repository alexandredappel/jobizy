import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Conversation, LastMessage } from "@/types/database.types";

export interface IConversationService {
  getConversations(userId: string): Promise<Conversation[]>;
  createConversation(participants: string[]): Promise<string>;
  updateLastMessage(conversationId: string, message: LastMessage): Promise<void>;
  toggleFavorite(conversationId: string, userId: string, isFavorite: boolean): Promise<void>;
  deleteConversation(conversationId: string): Promise<void>;
}

export class FirebaseConversationService implements IConversationService {
  async getConversations(userId: string): Promise<Conversation[]> {
    console.log('FirebaseConversationService: Getting conversations for user', userId);
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Conversation));
  }

  async createConversation(participants: string[]): Promise<string> {
    console.log('FirebaseConversationService: Creating conversation', { participants });
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      participants,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: {
        content: '',
        timestamp: new Date(),
        senderId: participants[0]
      }
    });
    
    return conversationRef.id;
  }

  async updateLastMessage(conversationId: string, message: LastMessage): Promise<void> {
    console.log('FirebaseConversationService: Updating last message', { conversationId, message });
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: message,
      updatedAt: new Date()
    });
  }

  async toggleFavorite(conversationId: string, userId: string, isFavorite: boolean): Promise<void> {
    console.log('FirebaseConversationService: Toggling favorite', { conversationId, userId, isFavorite });
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`isFavorite.${userId}`]: isFavorite,
      updatedAt: new Date()
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    console.log('FirebaseConversationService: Deleting conversation', conversationId);
    const conversationRef = doc(db, 'conversations', conversationId);
    await deleteDoc(conversationRef);
  }
}