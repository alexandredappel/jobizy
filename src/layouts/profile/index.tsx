import React from 'react';
import ProfileContainer from './ProfileContainer';
import ProfileHeader from './ProfileHeader';
import ProfileSection from './ProfileSection';

export { default as ProfileContainer } from './ProfileContainer';
export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileSection } from './ProfileSection';

// Helper for consistent profile layout structure
export const createProfileLayout = (
  headerProps: React.ComponentProps<typeof ProfileHeader>,
  children: React.ReactNode,
  containerProps: Omit<React.ComponentProps<typeof ProfileContainer>, 'children'>
) => (
  <ProfileContainer {...containerProps}>
    <ProfileHeader {...headerProps} />
    <div className="space-y-6">
      {children}
    </div>
  </ProfileContainer>
);