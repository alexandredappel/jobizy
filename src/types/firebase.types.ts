import { Timestamp } from 'firebase/firestore';

export interface WorkerUser {
  id: string;
  availability_status: boolean;
  email: string;
  full_name: string;
  gender: "male" | "female";
  job: string;
  languages: string[];
  location: string[];
  role: string;
  work_history: WorkExperience[];
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