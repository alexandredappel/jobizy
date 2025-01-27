import React from 'react';

interface ProfileContainerProps {
  children: React.ReactNode;
  type: 'worker' | 'business';
  mode: 'view' | 'edit';
}

const ProfileContainer = ({ children, type, mode }: ProfileContainerProps) => {
  return (
    <div className="container mx-auto p-4 pt-16 md:p-6 lg:py-8 lg:px-8 max-w-none">
      <div className="space-y-8 animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
};

export default ProfileContainer;