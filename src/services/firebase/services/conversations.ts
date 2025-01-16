import { db } from '../config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp,
  doc,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { Conversation } from '@/types/database.types';

export class ConversationService {
  private collection = collection(db, 'conversations');

  async create(data: { userId: string; recipientId: string }): Promise<Conversation> {
    console.log('ConversationService: Creating conversation', data);
    const timestamp = Timestamp.now();
    const docRef = await addDoc(this.collection, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastMessage: null,
      participants: [data.userId, data.recipientId]
    });

    console.log('ConversationService: Conversation created', { id: docRef.id });
    return {
      id: docRef.id,
      ...data,
      createdAt: timestamp.toDate(),
      updatedAt: timestamp.toDate(),
      lastMessage: null,
      participants: [data.userId, data.recipientId]
    };
  }

  async updateLastMessage(id: string, message: { content: string; timestamp: Date }): Promise<void> {
    console.log('ConversationService: Updating last message', { id, message });
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      lastMessage: {
        ...message,
        timestamp: Timestamp.fromDate(message.timestamp)
      },
      updatedAt: Timestamp.now()
    });
    console.log('ConversationService: Last message updated', { id });
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    console.log('ConversationService: Getting conversations for user', { userId });
    const q = query(
      this.collection,
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      lastMessage: doc.data().lastMessage ? {
        ...doc.data().lastMessage,
        timestamp: doc.data().lastMessage.timestamp.toDate()
      } : null
    } as Conversation));

    console.log('ConversationService: Found conversations', { 
      userId, 
      count: conversations.length 
    });
    
    return conversations;
  }

  async toggleFavorite(id: string, userId: string, isFavorite: boolean): Promise<void> {
    console.log('ConversationService: Toggling favorite status', { id, userId, isFavorite });
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      favoriteFor: isFavorite 
        ? arrayUnion(userId) 
        : arrayRemove(userId),
      updatedAt: Timestamp.now()
    });
    console.log('ConversationService: Favorite status toggled', { id });
  }

  async getFavoriteConversations(userId: string): Promise<Conversation[]> {
    console.log('ConversationService: Getting favorite conversations', { userId });
    const q = query(
      this.collection,
      where("favoriteFor", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      lastMessage: doc.data().lastMessage ? {
        ...doc.data().lastMessage,
        timestamp: doc.data().lastMessage.timestamp.toDate()
      } : null
    } as Conversation));

    console.log('ConversationService: Found favorite conversations', { 
      userId, 
      count: conversations.length 
    });
    
    return conversations;
  }
}