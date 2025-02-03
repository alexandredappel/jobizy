import { Timestamp } from 'firebase/firestore';

export type JobType = 'Waiter' | 'Cook' | 'Cashier' | 'Manager' | 'Housekeeper' | 'Gardener' | 'Pool guy' | 'Bartender' | 'Seller';

export type BusinessType = 'Restaurant' | 'Hotel' | 'Property Management' | 'Guest House' | 'Club';

export type WorkArea = 'Seminyak' | 'Kuta' | 'Kerobokan' | 'Canggu' | 'Umalas' | 'Ubud' | 'Uluwatu' | 'Denpasar' | 'Sanur' | 'Jimbaran' | 'Pererenan' | 'Nusa Dua';

export type Language = 'English' | 'Bahasa';

export type UserRole = 'worker' | 'business';

export interface BusinessUser {
  id: string;
  company_name: string;
  business_type: BusinessType;
  location: WorkArea;
  description?: string;
  profile_picture_url?: string;
  email: string;
  phone_number?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface WorkerUser {
  id: string;
  availability_status: boolean;
  email: string;
  full_name: string;
  gender: "male" | "female";
  job: JobType;
  type_contract: "Full time" | "Part time";
  languages: Language[];
  location: WorkArea[];
  work_history: WorkExperience[];
  education: Education[];
  profile_picture_url?: string;
  experience: string;
  phone_number?: string;
  birthday_date?: Timestamp;
  about_me?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Education {
  id: string;
  degree: string;
  start_date: Timestamp;
  end_date: Timestamp;
  institution: string;
  updated_at: Timestamp;
  user_id: string;
  created_at: Timestamp;
}

export interface WorkExperience {
  id: string;
  company: string;
  start_date: Timestamp;
  end_date: Timestamp;
  position: string;
  updated_at: Timestamp;
  user_id: string;
  created_at: Timestamp;
}