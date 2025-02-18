
// Types de base
export type JobType = 'Waiter' | 'Cook' | 'Cashier' | 'Manager' | 'Housekeeper' | 'Gardener' | 'Pool guy' | 'Bartender' | 'Seller';

export type BusinessType = 'restaurant' | 'hotel' | 'property_management' | 'guest_house' | 'club';

export type WorkArea = 'Seminyak' | 'Kuta' | 'Kerobokan' | 'Canggu' | 'Umalas' | 'Ubud' | 'Uluwatu' | 'Denpasar' | 'Sanur' | 'Jimbaran' | 'Pererenan' | 'Nusa Dua';

export type Language = 'English' | 'Bahasa';

export type UserRole = 'worker' | 'business';

export type ContractType = 'part_time' | 'full_time';

// Interface de base pour tous les utilisateurs
export interface BaseUser {
  id: string;
  role: UserRole;
  phone_number: string;
  email?: string;
  preferred_language?: string;
  is_verified?: boolean;
  created_at: Date;
  updated_at: Date;
}

// Interface Worker complète
export interface WorkerUser extends BaseUser {
  role: 'worker';
  full_name: string;
  profile_picture_url?: string;
  job?: JobType;
  experience?: string;
  location?: WorkArea[];
  languages?: Language[];
  contract_type?: ContractType;
  gender?: 'male' | 'female';
  about_me?: string;
  availability_status: boolean;
}

// Interface Business
export interface BusinessUser extends BaseUser {
  role: 'business';
  company_name: string;
  business_type: BusinessType;
  location: WorkArea;
  about_business?: string;
  logo_picture_url?: string;
  website?: string;
}

export type User = WorkerUser | BusinessUser;

// Interfaces pour les expériences et l'éducation
export interface WorkExperience {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  is_current_job: boolean;
  created_at: Date;
  updated_at: Date;
  types?: string[];
  primary_type?: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: Date;
  end_date?: Date;
  is_current_study: boolean;
  created_at: Date;
  updated_at: Date;
}
