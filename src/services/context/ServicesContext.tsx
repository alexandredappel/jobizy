import { createContext, useContext, ReactNode } from 'react';
import { AuthService } from '../firebase/services/auth';
import { UserService } from '../firebase/services/users';
import { MessageService } from '../firebase/services/messages';
import { ConversationService } from '../firebase/services/conversations';
import { WorkExperienceService } from '../firebase/services/workExperience';
import { EducationService } from '../firebase/services/education';

interface Services {
  auth: AuthService;
  users: UserService;
  messages: MessageService;
  conversations: ConversationService;
  workExperience: WorkExperienceService;
  education: EducationService;
}

const ServicesContext = createContext<Services | null>(null);

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider = ({ children }: ServicesProviderProps) => {
  const services: Services = {
    auth: new AuthService(),
    users: new UserService(),
    messages: new MessageService(),
    conversations: new ConversationService(),
    workExperience: new WorkExperienceService(),
    education: new EducationService()
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};