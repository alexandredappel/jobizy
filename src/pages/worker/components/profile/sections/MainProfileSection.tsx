import React, { useState } from 'react';
import { Edit, Clock, Globe, MapPin, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProfileContainer } from "@/layouts/profile";
import MainProfileEditModal from '../modals/MainProfileEditModal';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { WorkerUser } from '@/types/firebase.types';

interface MainProfileSectionProps {
  profile: WorkerUser | null;
  onSave: (values: Partial<WorkerUser>) => Promise<void>;
}

const MainProfileSection = ({ profile, onSave }: MainProfileSectionProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!profile) return null;

  const badgeSections = [
    {
      label: 'Work Schedule',
      icon: Clock,
      values: profile.experience ? [profile.experience] : ['0 years']
    },
    {
      label: 'Languages',
      icon: Globe,
      values: profile.languages?.length ? profile.languages : ['None']
    },
    {
      label: 'Location',
      icon: MapPin,
      values: profile.location?.length ? profile.location : ['Not specified']
    }
  ];

  const handleAvailabilityChange = async (checked: boolean) => {
    await onSave({ availability_status: checked });
  };

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="space-y-6">
        <div className="relative bg-white rounded-[var(--radius)]">
          <div className="absolute right-4 top-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={profile.availability_status}
                onCheckedChange={handleAvailabilityChange}
                aria-label="Availability toggle"
              />
              <span className="text-sm text-muted-foreground">
                {profile.availability_status ? "Available" : "Unavailable"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

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

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-6">
              {badgeSections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <div key={sectionIndex} className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Icon className="h-5 w-5" />
                      <span>{section.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {section.values.map((value, valueIndex) => (
                        <Badge 
                          key={valueIndex}
                          className="inline-flex items-center justify-center py-2 px-4 rounded-lg"
                          variant="secondary"
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
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