import React, { useState } from 'react';
import { ProfileContainer, ProfileHeader } from "@/layouts/profile";
import { WorkerUser } from '@/types/firebase.types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import MainProfileEditModal from '../modals/MainProfileEditModal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
      <div className="space-y-6">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-10 w-10 text-primary hover:text-primary-hover"
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="h-6 w-6" />
          </Button>

          <ProfileHeader
            image={profile.profile_picture_url}
            name={profile.full_name}
            role={profile.job}
            isAvailable={profile.availability_status}
            badges={badges}
            onAvailabilityChange={(value) => onSave({ availability_status: value })}
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h2 className="text-xl font-semibold text-secondary">About Me</h2>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-primary hover:text-primary-hover"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-6 w-6" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {profile.about_me || "No description provided yet."}
            </p>
          </CardContent>
        </Card>
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