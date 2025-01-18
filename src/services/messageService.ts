import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  Timestamp,
  doc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, Conversation } from '@/types/database.types';

export class MessageService {
  private messagesCollection = collection(db, 'messages');
  private conversationsCollection = collection(db, 'conversations');

  async createMessage(data: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>): Promise<Message> {
    try {
      const timestamp = Timestamp.now();
      const docRef = await addDoc(this.messagesCollection, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        isRead: false
      });

      const message = {
        id: docRef.id,
        ...data,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate(),
        isRead: false
      };

      // Update conversation's last message
      await this.updateConversationLastMessage(data.conversationId, {
        content: data.content,
        timestamp: timestamp.toDate()
      });

      return message;
    } catch (error: any) {
      console.error('Create message error:', error);
      throw new Error(error.message);
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const docRef = doc(this.messagesCollection, id);
      await updateDoc(docRef, {
        isRead: true,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      throw new Error(error.message);
    }
  }

  async getConversationMessages(conversationId: string, messageLimit: number = 50): Promise<Message[]> {
    try {
      const q = query(
        this.messagesCollection, 
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "desc"),
        limit(messageLimit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Message[];
    } catch (error: any) {
      console.error('Get conversation messages error:', error);
      throw new Error(error.message);
    }
  }

  private async updateConversationLastMessage(
    conversationId: string, 
    lastMessage: { content: string; timestamp: Date; }
  ): Promise<void> {
    try {
      const docRef = doc(this.conversationsCollection, conversationId);
      await updateDoc(docRef, {
        lastMessage,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Update conversation last message error:', error);
      throw new Error(error.message);
    }
  }

  async createConversation(participants: string[]): Promise<Conversation> {
    try {
      const timestamp = Timestamp.now();
      const docRef = await addDoc(this.conversationsCollection, {
        participants,
        createdAt: timestamp,
        updatedAt: timestamp,
        favoriteFor: []
      });

      return {
        id: docRef.id,
        participants,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate(),
        favoriteFor: []
      };
    } catch (error: any) {
      console.error('Create conversation error:', error);
      throw new Error(error.message);
    }
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        this.conversationsCollection,
        where("participants", "array-contains", userId),
        orderBy("updatedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Conversation[];
    } catch (error: any) {
      console.error('Get user conversations error:', error);
      throw new Error(error.message);
    }
  }
}