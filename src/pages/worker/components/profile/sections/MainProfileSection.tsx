import React, { useState } from 'react';
import { ProfileContainer } from "@/layouts/profile";
import { WorkerUser } from '@/types/firebase.types';
import { Button } from '@/components/ui/button';
import { Edit, Briefcase } from 'lucide-react';
import MainProfileEditModal from '../modals/MainProfileEditModal';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
            className="absolute right-4 top-4"
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center -mt-16">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src={profile.profile_picture_url} alt={profile.full_name} />
              <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-2xl font-bold text-primary">{profile.full_name}</h2>
            
            <Badge className="mt-2 px-4 py-2 flex items-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20">
              <Briefcase className="h-4 w-4" />
              {profile.job}
            </Badge>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {badges.map((badge, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm text-muted-foreground">{badge.label}</p>
                  <p className="font-medium">{badge.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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