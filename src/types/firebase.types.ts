export type JobType = 'Waiter' | 'Cook' | 'Cashier' | 'Manager' | 'Housekeeper' | 'Gardener' | 'Pool guy' | 'Bartender' | 'Seller';

export type BusinessType = 'restaurant' | 'hotel' | 'property_management' | 'guest_house' | 'club';

export type WorkArea = 'Seminyak' | 'Kuta' | 'Kerobokan' | 'Canggu' | 'Umalas' | 'Ubud' | 'Uluwatu' | 'Denpasar' | 'Sanur' | 'Jimbaran' | 'Pererenan' | 'Nusa Dua';

export type Language = 'English' | 'Bahasa';

export type UserRole = 'worker' | 'business';

interface BaseUser {
  id: string;
  phoneNumber: string;
  role: UserRole;
  displayName: string;
  preferred_language?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  password?: string;
}

export type ContractType = 'part_time' | 'full_time';

export interface WorkerUser {
  id: string;
  profile_picture_url?: string;
  full_name: string;
  job?: JobType;
  experience?: string;
  location?: WorkArea[];
  languages?: Language[];
  availability_status: boolean;
  gender?: 'male' | 'female';
  contract_type?: ContractType;
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
