import React from 'react';
import { cn } from "@/lib/utils";
import { UserRole } from '@/types/database.types';

interface ProfileContainerProps {
  children: React.ReactNode;
  type: UserRole;
  mode: 'view' | 'edit';
  className?: string;
}

const ProfileContainer = ({ children, type, mode, className }: ProfileContainerProps) => {
  return (
    <div className={cn(
      "container mx-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl",
      "animate-in fade-in duration-500",
      className
    )}>
      {children}
    </div>
  );
};

export default ProfileContainer;