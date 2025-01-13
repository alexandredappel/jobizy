import { UserProfile, Message, Conversation, WorkExperience, Education, Timestamp } from "@/types/database.types";

// Fonction utilitaire pour créer un Timestamp
const createTimestamp = (date: Date): Timestamp => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: (date.getTime() % 1000) * 1000000
});

// Données mockées temporaires - à compléter avec vos besoins
export const mockUsers: UserProfile[] = [
  {
    id: "user1",
    createdAt: createTimestamp(new Date()),
    // ... autres champs à venir
  }
];

export const mockMessages: Message[] = [
  {
    id: "msg1",
    createdAt: createTimestamp(new Date()),
    // ... autres champs à venir
  }
];

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    createdAt: createTimestamp(new Date()),
    // ... autres champs à venir
  }
];

export const mockWorkExperiences: WorkExperience[] = [
  {
    id: "exp1",
    createdAt: createTimestamp(new Date()),
    // ... autres champs à venir
  }
];

export const mockEducation: Education[] = [
  {
    id: "edu1",
    createdAt: createTimestamp(new Date()),
    // ... autres champs à venir
  }
];