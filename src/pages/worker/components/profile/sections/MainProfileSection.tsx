import React, { useState } from 'react';
import { ProfileContainer, ProfileHeader } from "@/layouts/profile";
import { WorkerUser } from '@/types/firebase.types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import MainProfileEditModal from '../modals/MainProfileEditModal';

interface MainProfileSectionProps {
  profile: WorkerUser | null;
  onSave: (values: Partial<WorkerUser>) => Promise<void>;
}

const MainProfileSection = ({ profile, onSave }: MainProfileSectionProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) return null;

  const badges = [
    { label: 'Experience', value: profile.experience || '0 years' },
    { label: 'Languages', value: profile.languages?.join(', ') || 'None' },
    { label: 'Location', value: profile.location?.join(', ') || 'Not specified' }
  ];

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => setShowEditModal(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <ProfileHeader
          image={profile.profile_picture_url}
          name={profile.full_name}
          role={profile.job}
          isAvailable={profile.availability_status}
          badges={badges}
          onAvailabilityChange={(value) => onSave({ availability_status: value })}
        />

        {profile.about_me && (
          <div className="mt-6 px-4">
            <h3 className="text-lg font-semibold mb-2">About Me</h3>
            <p className="text-muted-foreground">{profile.about_me}</p>
          </div>
        )}
      </div>

      <MainProfileEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={onSave}
      />
    </ProfileContainer>
  );
};

export default MainProfileSection;