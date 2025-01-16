import { db } from '../config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  doc 
} from 'firebase/firestore';
import { Message } from '@/types/database.types';

export class MessageService {
  private collection = collection(db, 'messages');

  async create(data: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>): Promise<Message> {
    console.log('MessageService: Creating message', data);
    const timestamp = Timestamp.now();
    const docRef = await addDoc(this.collection, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      isRead: false
    });

    console.log('MessageService: Message created', { id: docRef.id });
    return {
      id: docRef.id,
      ...data,
      createdAt: timestamp.toDate(),
      updatedAt: timestamp.toDate(),
      isRead: false
    };
  }

  async markAsRead(id: string): Promise<void> {
    console.log('MessageService: Marking message as read', { id });
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      isRead: true,
      updatedAt: Timestamp.now()
    });
    console.log('MessageService: Message marked as read', { id });
  }

  async getConversationMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    console.log('MessageService: Getting messages for conversation', { conversationId, limit });
    const q = query(
      this.collection, 
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Message));

    console.log('MessageService: Found messages', { 
      conversationId, 
      count: messages.length 
    });
    
    return messages;
  }

  async getUnreadCount(userId: string): Promise<number> {
    console.log('MessageService: Getting unread count for user', { userId });
    const q = query(
      this.collection,
      where("recipientId", "==", userId),
      where("isRead", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('MessageService: Unread count', { count: querySnapshot.size });
    return querySnapshot.size;
  }
}