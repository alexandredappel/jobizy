
import React, { useState } from 'react';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  MainProfileSection,
  WorkExperienceSection,
  EducationSection,
  AboutMeSection,
} from './components/profile';
import { 
  SettingsModal,
  WorkExperienceModal,
  EducationModal,
  AboutMeModal,
  MainProfileEditModal,
} from './components/profile/modals';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { useWorkerEducation } from "@/hooks/useWorkerEducation";
import { useWorkerExperience } from "@/hooks/useWorkerExperience";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkerUser } from '@/types/firebase.types';
import LanguageSelector from '@/components/ui/language-selector';

const WorkerProfileEdit = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useWorkerProfile(user?.id || '');
  const { experience, isLoading: expLoading } = useWorkerExperience(user?.id || '');
  const { education, isLoading: eduLoading } = useWorkerEducation(user?.id || '');
  
  const [showWorkExperienceModal, setShowWorkExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMainProfileModal, setShowMainProfileModal] = useState(false);
  const [showAboutMeModal, setShowAboutMeModal] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = async (values: Partial<WorkerUser>) => {
    try {
      console.log('Saving profile changes:', values);
      await updateProfile(values);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (profileLoading || expLoading || eduLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-8 w-8 ml-auto" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eefceb]">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-end mb-4 relative">
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettingsModal(true)}
              className="text-muted-foreground hover:text-primary"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <MainProfileSection
          profile={profile}
          onEdit={() => setShowMainProfileModal(true)}
          onSave={handleSaveChanges}
        />

        <AboutMeSection
          aboutMe={profile?.about_me}
          isLoading={profileLoading}
          onEdit={() => setShowAboutMeModal(true)}
        />

        <WorkExperienceSection
          experiences={experience}
          isLoading={expLoading}
          onEdit={() => setShowWorkExperienceModal(true)}
        />

        <EducationSection
          education={education}
          isLoading={eduLoading}
          onEdit={() => setShowEducationModal(true)}
        />

        <MainProfileEditModal
          open={showMainProfileModal}
          onClose={() => setShowMainProfileModal(false)}
          profile={profile}
          onSave={handleSaveChanges}
        />

        <AboutMeModal
          open={showAboutMeModal}
          onClose={() => setShowAboutMeModal(false)}
          aboutMe={profile?.about_me || ""}
          userId={user?.id || ""}
        />

        <WorkExperienceModal
          open={showWorkExperienceModal}
          onClose={() => setShowWorkExperienceModal(false)}
          experiences={experience}
          userId={user?.id || ''}
        />

        <EducationModal
          open={showEducationModal}
          onClose={() => setShowEducationModal(false)}
          education={education}
          userId={user?.id || ''}
        />

        <SettingsModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          profile={profile}
        />
      </div>
    </div>
  );
};

export default WorkerProfileEdit;
