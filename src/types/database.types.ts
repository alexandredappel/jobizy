import { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  email: string;
  phoneNumber: string;
  role: 'worker' | 'business';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Worker specific fields
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female';
  job?: 'Waiter' | 'Cook' | 'Cashier' | 'Manager' | 'Housekeeper' | 'Gardener' | 'Pool guy' | 'Bartender' | 'Seller';
  languages?: Array<'English' | 'Bahasa'>;
  workAreas?: Array<'Seminyak' | 'Kuta' | 'Kerobokan' | 'Canggu' | 'Umalas' | 'Ubud' | 'Uluwatu' | 'Denpasar' | 'Sanur' | 'Jimbaran' | 'Pererenan' | 'Nusa Dua'>;
  availability_status?: boolean;
  aboutMe?: string;
  birthday_date?: Timestamp;
  profile_picture_url?: string;
  
  // Business specific fields
  company_name?: string;
  business_type?: 'restaurant' | 'hotel' | 'property_management' | 'guest_house' | 'club';
  location?: 'Seminyak' | 'Kuta' | 'Kerobokan' | 'Canggu' | 'Umalas' | 'Ubud' | 'Uluwatu' | 'Denpasar' | 'Sanur' | 'Jimbaran' | 'Pererenan' | 'Nusa Dua';
  aboutBusiness?: string;
  logo_picture_url?: string;
  website?: string;
};

export type LastMessage = {
  content: string;
  timestamp: Timestamp;
  senderId: string;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: LastMessage;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isFavorite?: {
    [userId: string]: boolean;
  };
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
  readAt?: Timestamp;
};

export type WorkExperience = {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  isCurrentJob?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Education = {
  id: string;
  userId: string;
  institutionName: string;
  degree: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  isCurrentEducation?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};