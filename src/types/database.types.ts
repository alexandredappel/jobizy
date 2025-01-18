export type JobType = 'Waiter' | 'Cook' | 'Cashier' | 'Manager' | 'Housekeeper' | 'Gardener' | 'Pool guy' | 'Bartender' | 'Seller';

export type BusinessType = 'restaurant' | 'hotel' | 'property_management' | 'guest_house' | 'club';

export type WorkArea = 'Seminyak' | 'Kuta' | 'Kerobokan' | 'Canggu' | 'Umalas' | 'Ubud' | 'Uluwatu' | 'Denpasar' | 'Sanur' | 'Jimbaran' | 'Pererenan' | 'Nusa Dua';

export type Language = 'English' | 'Bahasa';

export type UserRole = 'worker' | 'business';

export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface WorkerProfile extends BaseUser {
  role: 'worker';
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  birthday_date?: Date;
  job: JobType;
  languages: Language[];
  workAreas: WorkArea[];
  availability_status: boolean;
  aboutMe?: string;
  profile_picture_url?: string;
}

export interface BusinessProfile extends BaseUser {
  role: 'business';
  company_name: string;
  business_type: BusinessType;
  location: WorkArea;
  aboutBusiness?: string;
  logo_picture_url?: string;
  website?: string;
}

export type User = WorkerProfile | BusinessProfile;

export interface WorkExperience {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentJob: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  isCurrentStudy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  favoriteFor: string[];
}