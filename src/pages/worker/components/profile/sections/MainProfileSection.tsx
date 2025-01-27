import React, { useState } from 'react';
import { ProfileContainer } from "@/layouts/profile";
import { WorkerUser } from '@/types/firebase.types';
import { Button } from '@/components/ui/button';
import { Edit, Briefcase, Clock, Globe, MapPin } from 'lucide-react';
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
    { label: 'Work Schedule', value: profile.experience || '0 years', icon: Clock },
    { label: 'Languages', value: profile.languages?.join(', ') || 'None', icon: Globe },
    { label: 'Location', value: profile.location?.join(', ') || 'Not specified', icon: MapPin }
  ];

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="space-y-6">
        <div className="relative bg-accent rounded-[var(--radius)]">
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
            
            <Badge className="mt-2 px-6 py-3 flex items-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 text-lg">
              <Briefcase className="h-5 w-5" />
              {profile.job}
            </Badge>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-6">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <Badge 
                      className="w-full flex items-center justify-center gap-2 py-2 px-4"
                      variant="secondary"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{badge.value}</span>
                    </Badge>
                    <p className="text-sm text-muted-foreground">{badge.label}</p>
                  </div>
                );
              })}
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