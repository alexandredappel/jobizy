export interface User {
  uid: string;
  email: string;
  role: 'worker' | 'business';
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchCriteria {
  query: string;
  location?: string;
  jobType?: string[];
  experience?: string[];
  availability?: string[];
  languages?: string[];
  skills?: string[];
}
