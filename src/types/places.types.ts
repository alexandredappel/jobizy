
import { Timestamp } from 'firebase/firestore';

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  types: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface GooglePlaceResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceWorkExperience {
  id?: string;
  user_id: string;
  company: string;
  position: string;
  start_date: Timestamp;
  end_date?: Timestamp | null;
  place_details?: PlaceDetails;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface PlaceEducation {
  id?: string;
  user_id: string;
  institution: string;
  degree: string;
  start_date: Timestamp;
  end_date?: Timestamp | null;
  place_details?: PlaceDetails;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
