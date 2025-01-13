import { createContext, useContext, ReactNode } from 'react';
import { IUserService } from '../interfaces/userService.interface';
import { IMessageService } from '../interfaces/messageService.interface';
import { IConversationService } from '../interfaces/conversationService.interface';
import { IWorkExperienceService } from '../interfaces/workExperienceService.interface';
import { IEducationService } from '../interfaces/educationService.interface';

interface Services {
  userService: IUserService;
  messageService: IMessageService;
  conversationService: IConversationService;
  workExperienceService: IWorkExperienceService;
  educationService: IEducationService;
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