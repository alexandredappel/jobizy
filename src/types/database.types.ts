// Types de base pour la base de données
export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

// Types temporaires - à compléter avec les détails que vous fournirez
export type UserProfile = {
  id: string;
  createdAt: Timestamp;
  // ... autres champs à venir
};

export type Message = {
  id: string;
  createdAt: Timestamp;
  // ... autres champs à venir
};

export type Conversation = {
  id: string;
  createdAt: Timestamp;
  // ... autres champs à venir
};

export type WorkExperience = {
  id: string;
  createdAt: Timestamp;
  // ... autres champs à venir
};

export type Education = {
  id: string;
  createdAt: Timestamp;
  // ... autres champs à venir
};