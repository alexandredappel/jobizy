import { UserProfile, Message, Conversation, WorkExperience, Education, Timestamp } from "@/types/database.types";

// Utility function to create a Timestamp
const createTimestamp = (date: Date): Timestamp => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: (date.getTime() % 1000) * 1000000
});

// Mock data - to be completed with your needs
export const mockUsers: UserProfile[] = [
  {
    id: "user1",
    email: "user1@example.com",
    phoneNumber: "+62123456789",
    role: "worker",
    createdAt: createTimestamp(new Date()),
    updatedAt: createTimestamp(new Date()),
    // ... autres champs à venir
  }
];

export const mockMessages: Message[] = [
  {
    id: "msg1",
    conversationId: "conv1",
    senderId: "user1",
    content: "Hello",
    timestamp: createTimestamp(new Date()),
    isRead: false,
  }
];

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["user1", "user2"],
    lastMessage: {
      content: "Hello",
      timestamp: createTimestamp(new Date()),
      senderId: "user1"
    },
    createdAt: createTimestamp(new Date()),
    updatedAt: createTimestamp(new Date()),
  }
];

export const mockWorkExperiences: WorkExperience[] = [
  {
    id: "exp1",
    userId: "user1",
    companyName: "Sample Company",
    position: "Waiter",
    startDate: createTimestamp(new Date(2020, 0, 1)),
    createdAt: createTimestamp(new Date()),
    updatedAt: createTimestamp(new Date()),
  }
];

export const mockEducation: Education[] = [
  {
    id: "edu1",
    userId: "user1",
    institutionName: "Sample University",
    degree: "Bachelor's Degree",
    startDate: createTimestamp(new Date(2016, 0, 1)),
    endDate: createTimestamp(new Date(2020, 0, 1)),
    createdAt: createTimestamp(new Date()),
    updatedAt: createTimestamp(new Date()),
  }
];