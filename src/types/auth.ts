import { Timestamp } from "./database.types";

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  role: 'worker' | 'business';
  
  // Worker specific fields
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female';
  job?: string;
  languages?: string[];
  workAreas?: string[];
  availability_status?: boolean;
  aboutMe?: string;
  birthday_date?: Timestamp;
  profile_picture_url?: string;
  
  // Business specific fields
  company_name?: string;
  business_type?: 'restaurant' | 'hotel' | 'property_management' | 'guest_house' | 'club';
  location?: string;
  aboutBusiness?: string;
  logo_picture_url?: string;
  website?: string;
}