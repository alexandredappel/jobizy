import React, { useState } from 'react';
import { Edit, Clock, Globe, MapPin } from 'lucide-react';
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

  const handleAvailabilityChange = async (checked: boolean) => {
    await onSave({ availability_status: checked });
  };

  const renderBadges = (values: string[]) => {
    if (!values?.length) return ['None'];
    if (values.length <= 2) return values;
    return [...values.slice(0, 2), `+${values.length - 2} others`];
  };

  const badgeSections = [
    {
      label: 'Work Schedule',
      icon: Clock,
      values: profile.experience ? [profile.experience] : ['0 years']
    },
    {
      label: 'Languages',
      icon: Globe,
      values: profile.languages || []
    },
    {
      label: 'Location',
      icon: MapPin,
      values: profile.location || []
    }
  ];

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="space-y-6">
        <div className="relative bg-white rounded-[var(--radius)] pt-16">
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

          <div className="flex flex-col items-center">
            <div className="absolute -top-16">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.profile_picture_url} alt={profile.full_name} />
                <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <h2 className="text-2xl font-bold text-primary mt-6">{profile.full_name}</h2>
            
            <Badge className="mt-2 px-6 py-3 flex items-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 text-lg">
              {profile.job}
            </Badge>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-6">
              {badgeSections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <div key={sectionIndex} className="flex flex-col items-center bg-primary text-white p-4 rounded-lg">
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="mb-3">{section.label}</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {renderBadges(section.values).map((value, index) => (
                        <Badge 
                          key={index}
                          className="text-sm bg-white text-primary px-4 py-2 rounded-lg"
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