import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, Conversation } from '@/types/database.types';

export class MessageService {
  private messageCollection = collection(db, 'messages');
  private conversationCollection = collection(db, 'conversations');

  async createConversation(userId: string, recipientId: string): Promise<string> {
    try {
      const docRef = await addDoc(this.conversationCollection, {
        participants: [userId, recipientId],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastMessage: null,
        favoriteFor: []
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Create conversation error:', error);
      throw new Error(error.message);
    }
  }

  async sendMessage(conversationId: string, senderId: string, recipientId: string, content: string): Promise<Message> {
    try {
      const timestamp = Timestamp.now();
      const messageData = {
        conversationId,
        senderId,
        recipientId,
        content,
        isRead: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const docRef = await addDoc(this.messageCollection, messageData);
      
      // Update conversation's last message
      await updateDoc(doc(this.conversationCollection, conversationId), {
        lastMessage: {
          content,
          timestamp
        },
        updatedAt: timestamp
      });

      return {
        id: docRef.id,
        ...messageData,
        createdAt: timestamp.toDate(),
        updatedAt: timestamp.toDate()
      };
    } catch (error: any) {
      console.error('Send message error:', error);
      throw new Error(error.message);
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await updateDoc(doc(this.messageCollection, messageId), {
        isRead: true,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Mark message as read error:', error);
      throw new Error(error.message);
    }
  }

  async getConversationMessages(conversationId: string, limitCount: number = 50): Promise<Message[]> {
    try {
      const q = query(
        this.messageCollection,
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
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

  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void): () => void {
    const q = query(
      this.messageCollection,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Message[];
      
      callback(messages);
    });
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        this.conversationCollection,
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        lastMessage: doc.data().lastMessage ? {
          ...doc.data().lastMessage,
          timestamp: doc.data().lastMessage.timestamp.toDate()
        } : null
      })) as Conversation[];
    } catch (error: any) {
      console.error('Get user conversations error:', error);
      throw new Error(error.message);
    }
  }
}