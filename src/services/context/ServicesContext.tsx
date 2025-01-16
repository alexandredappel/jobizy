import { createContext, useContext, ReactNode } from 'react';
import { AuthService } from '../firebase/services/auth';
import { UserService } from '../firebase/services/users';
import { WorkExperienceService } from '../firebase/services/workExperience';

interface Services {
  auth: AuthService;
  users: UserService;
  workExperience: WorkExperienceService;
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