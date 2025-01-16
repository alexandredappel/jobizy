import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message } from "@/types/database.types";

export interface IMessageService {
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string>;
  markAsRead(messageId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
}

export class FirebaseMessageService implements IMessageService {
  async getMessages(conversationId: string): Promise<Message[]> {
    console.log('FirebaseMessageService: Getting messages for conversation', conversationId);
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  }

  async sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
    console.log('FirebaseMessageService: Sending message', { conversationId, message });
    const messageRef = await addDoc(collection(db, 'messages'), {
      ...message,
      conversationId,
      timestamp: new Date(),
      isRead: false
    });
    
    return messageRef.id;
  }

  async markAsRead(messageId: string): Promise<void> {
    console.log('FirebaseMessageService: Marking message as read', messageId);
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      isRead: true,
      readAt: new Date()
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    console.log('FirebaseMessageService: Deleting message', messageId);
    const messageRef = doc(db, 'messages', messageId);
    await deleteDoc(messageRef);
  }
}