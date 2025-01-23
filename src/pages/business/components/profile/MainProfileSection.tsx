import React, { useState } from 'react';
import { ProfileContainer, ProfileHeader } from "@/layouts/profile";
import { BusinessUser } from '@/types/firebase.types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import MainProfileEditModal from './modals/MainProfileEditModal';
import { Card, CardContent } from '@/components/ui/card';

interface MainProfileSectionProps {
  profile: BusinessUser | null;
  onSave: (values: Partial<BusinessUser>) => Promise<void>;
}

const MainProfileSection = ({ profile, onSave }: MainProfileSectionProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) return null;

  const badges = [
    { label: 'Business Type', value: profile.business_type },
    { label: 'Location', value: profile.location }
  ];

  return (
    <ProfileContainer type="business" mode="edit">
      <div className="space-y-6">
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
            name={profile.company_name}
            businessType={profile.business_type}
            badges={badges}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">About the Company</h3>
            <p className="text-muted-foreground">
              {profile.description || "No description provided yet."}
            </p>
          </CardContent>
        </Card>
      </div>

      <MainProfileEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        updateProfile={onSave}
      />
    </ProfileContainer>
  );
};

export default MainProfileSection;