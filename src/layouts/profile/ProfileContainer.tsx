import React from 'react';

interface ProfileContainerProps {
  children: React.ReactNode;
  type: 'worker' | 'business';
  mode: 'view' | 'edit';
}

const ProfileContainer = ({ children, type, mode }: ProfileContainerProps) => {
  return (
    <div className="mx-auto max-w-none">
      <div className="space-y-8 animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
};

export default ProfileContainer;