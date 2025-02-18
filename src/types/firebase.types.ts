// Types de base
export type JobType = 'Waiter' | 'Cook' | 'Cashier' | 'Manager' | 'Housekeeper' | 'Gardener' | 'Pool technician' | 'Bartender' | 'Seller';

export type BusinessType = 'Restaurant' | 'Hotel' | 'Property Management' | 'Guest House' | 'Club';

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
  created_at: Date | { toDate(): Date };
  updated_at: Date | { toDate(): Date };
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
  type_contract?: string; // Pour la rétrocompatibilité
  gender?: 'male' | 'female';
  about_me?: string;
  availability_status: boolean;
  description?: string; // Pour la rétrocompatibilité
}

// Interface Business
export interface BusinessUser extends BaseUser {
  role: 'business';
  company_name: string;
  business_type: BusinessType;
  location: WorkArea;
  about_business?: string;
  description?: string; // Pour la rétrocompatibilité
  logo_picture_url?: string;
  profile_picture_url?: string; // Pour la rétrocompatibilité
  website?: string;
}

export type User = WorkerUser | BusinessUser;

// Interfaces pour les expériences et l'éducation
export interface WorkExperience {
  id: string;
  user_id: string;
  company_name: string;
  company?: string; // Pour la rétrocompatibilité
  position: string;
  description: string;
  start_date: Date | { toDate(): Date };
  end_date?: Date | { toDate(): Date };
  is_current_job: boolean;
  created_at: Date | { toDate(): Date };
  updated_at: Date | { toDate(): Date };
  types?: string[];
  primary_type?: string;
  primaryType?: string; // Pour la rétrocompatibilité
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: Date | { toDate(): Date };
  end_date?: Date | { toDate(): Date };
  is_current_study: boolean;
  created_at: Date | { toDate(): Date };
  updated_at: Date | { toDate(): Date };
}

export interface SearchCriteria {
  job?: JobType;
  workArea?: WorkArea;
  languages?: Language[];
  gender?: 'male' | 'female';
  contractType?: ContractType;
  availability?: boolean;
}
