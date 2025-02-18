
export interface User {
  id: string;
  email: string;
  role: 'worker' | 'business';
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  full_name?: string;
  profile_picture_url?: string;
  preferred_language?: string;
  created_at: Date;
  updated_at: Date;
  description?: string;
}

export interface WorkerUser extends User {
  job: JobType;
  type_contract: ContractType;
  location: WorkArea[];
  languages: Language[];
  about_me?: string;
  availability_status: boolean;
  experience?: string;
  gender?: 'male' | 'female';
  workAreas?: WorkArea[];
  contract_type?: ContractType;
}

export interface BusinessUser extends User {
  company_name: string;
  business_type: BusinessType;
  location: WorkArea[];
  languages: Language[];
  about_me?: string;
  subscription_status?: 'free' | 'premium';
  remaining_contacts?: number;
  description?: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: Date;
  end_date?: Date;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WorkExperience {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location?: string;
  start_date: Date;
  end_date?: Date;
  description?: string;
  types: string[];
  primaryType: string | null;
  created_at: Date;
  updated_at: Date;
}

export type JobType = 
  | 'Waiter' 
  | 'Cook' 
  | 'Cashier' 
  | 'Manager' 
  | 'Housekeeper'
  | 'Gardener'
  | 'Pool technician'
  | 'Bartender'
  | 'Seller';

export type Language = 'English' | 'Bahasa';

export type WorkArea = 
  | 'Seminyak'
  | 'Kuta'
  | 'Kerobokan'
  | 'Canggu'
  | 'Umalas'
  | 'Ubud'
  | 'Uluwatu'
  | 'Denpasar'
  | 'Sanur'
  | 'Jimbaran'
  | 'Pererenan'
  | 'Nusa Dua'
  | 'Property Management'
  | 'Guest House'
  | 'Club';

export type ContractType = 'Full time' | 'Part time' | 'full_time';

export type BusinessType = 
  | 'Restaurant'
  | 'Hotel'
  | 'Bar'
  | 'Cafe'
  | 'Resort'
  | 'Villa'
  | 'Shop'
  | 'Other'
  | 'Property Management'
  | 'Guest House'
  | 'Club';

export type UserRole = 'worker' | 'business';

export interface SearchCriteria {
  query: string;
  location?: string;
  jobType?: string[];
  experience?: string[];
  availability?: string[];
  languages?: string[];
  skills?: string[];
}
