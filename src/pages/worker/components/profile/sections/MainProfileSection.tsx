import React from 'react';
import { ProfileContainer, ProfileHeader } from "@/layouts/profile";
import { WorkerUser } from '@/types/firebase.types';

interface MainProfileEditProps {
  profile: WorkerUser | null;
  onSave: (values: Partial<WorkerUser>) => Promise<void>;
}

const MainProfileSection = ({ profile, onSave }: MainProfileEditProps) => {
  if (!profile) return null;

  const badges = [
    { label: 'Experience', value: profile.experience || '0 years' },
    { label: 'Languages', value: profile.languages?.join(', ') || 'None' },
    { label: 'Location', value: profile.location?.join(', ') || 'Not specified' }
  ];

  return (
    <ProfileContainer type="worker" mode="edit">
      <ProfileHeader
        image={profile.profile_picture_url}
        name={profile.full_name}
        role={profile.job}
        isAvailable={profile.availability_status}
        badges={badges}
        onAvailabilityChange={(value) => onSave({ availability_status: value })}
      />
    </ProfileContainer>
  );
};

export default MainProfileSection;