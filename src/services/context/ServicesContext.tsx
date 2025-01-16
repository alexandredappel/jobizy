import { createContext, useContext, ReactNode } from 'react';
import { FirebaseWorkExperienceService } from '../interfaces/workExperienceService.interface';
import { FirebaseEducationService } from '../interfaces/educationService.interface';
import { FirebaseMessageService } from '../interfaces/messageService.interface';
import { FirebaseConversationService } from '../interfaces/conversationService.interface';
import { FirebaseUserService } from '../interfaces/userService.interface';

interface Services {
  userService: FirebaseUserService;
  messageService: FirebaseMessageService;
  conversationService: FirebaseConversationService;
  workExperienceService: FirebaseWorkExperienceService;
  educationService: FirebaseEducationService;
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
  services: Services;
}

export const ServicesProvider = ({ children, services }: ServicesProviderProps) => {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};