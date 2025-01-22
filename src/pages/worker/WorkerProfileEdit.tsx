import React, { useState } from 'react';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  MainProfileSection,
  WorkExperienceSection,
  EducationSection,
  SettingsModal,
} from './components/profile';
import WorkExperienceListModal from './components/profile/modals/WorkExperienceListModal';
import EducationListModal from './components/profile/modals/EducationListModal';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { useWorkerEducation } from "@/hooks/useWorkerEducation";
import { useWorkerExperience } from "@/hooks/useWorkerExperience";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkerUser } from '@/types/firebase.types';

const WorkerProfileEdit = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useWorkerProfile(user?.id || '');
  const { experience, isLoading: expLoading } = useWorkerExperience(user?.id || '');
  const { education, isLoading: eduLoading } = useWorkerEducation(user?.id || '');
  
  const [showWorkExperienceModal, setShowWorkExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = async (values: Partial<WorkerUser>) => {
    try {
      // Implementation will be added later
      console.log('Saving values:', values);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully."
      });
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettingsModal(true)}
            className="text-muted-foreground hover:text-primary"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <MainProfileSection
          profile={profile}
          onSave={handleSaveChanges}
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

        <WorkExperienceListModal
          open={showWorkExperienceModal}
          onClose={() => setShowWorkExperienceModal(false)}
          experiences={experience}
          userId={user?.id || ''}
        />

        <EducationListModal
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