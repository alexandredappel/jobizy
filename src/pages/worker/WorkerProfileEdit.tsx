import React, { useState } from 'react';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileContainer, ProfileHeader, ProfileSection } from "@/layouts/profile";
import { MainProfileSection } from './components/profile';
import { SettingsModal } from './components/profile/modals/SettingsModal';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { Skeleton } from "@/components/ui/skeleton";
import LanguageSelector from '@/components/ui/language-selector';
import type { WorkerUser } from '@/types/firebase.types';

const WorkerProfileEdit = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useWorkerProfile(user?.id || '');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = async (values: Partial<WorkerUser>) => {
    try {
      console.log('Saving profile changes:', values);
      await updateProfile(values);
      toast({
        title: "Success",
        description: "Profile updated successfully",
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

  if (isLoading) {
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
        <div className="flex justify-end items-center gap-2 mb-4">
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

        <MainProfileSection
          profile={profile}
          onEdit={() => setShowMainProfileModal(true)}
          onSave={handleSaveChanges}
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
