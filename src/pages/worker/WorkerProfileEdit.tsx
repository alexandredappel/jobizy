import React, { useState } from 'react';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainProfileEdit } from './components/profile';
import { WorkExperienceModal } from './components/profile';
import { EducationModal } from './components/profile';
import { SettingsModal } from './components/profile';
import { useToast } from "@/hooks/use-toast";

const WorkerProfileEdit = () => {
  const [showWorkExperienceModal, setShowWorkExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { toast } = useToast();

  // Mock data for development - replace with actual data fetching
  const workerData = {
    image: "/placeholder.svg",
    name: "John Doe",
    role: "Waiter",
    isAvailable: true,
    badges: [
      { label: "Experience", value: "2 years" },
      { label: "Languages", value: "2" }
    ]
  };

  const handleSaveChanges = async (values: any) => {
    try {
      // Implement save logic here
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
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

        <MainProfileEdit
          {...workerData}
          onSave={handleSaveChanges}
        />

        <WorkExperienceModal
          open={showWorkExperienceModal}
          onClose={() => setShowWorkExperienceModal(false)}
          onSave={(data) => {
            console.log('Save work experience:', data);
            setShowWorkExperienceModal(false);
            toast({
              title: "Work experience updated",
              description: "Your work experience has been saved successfully."
            });
          }}
        />

        <EducationModal
          open={showEducationModal}
          onClose={() => setShowEducationModal(false)}
          onSave={(data) => {
            console.log('Save education:', data);
            setShowEducationModal(false);
            toast({
              title: "Education updated",
              description: "Your education has been saved successfully."
            });
          }}
        />

        <SettingsModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSave={(data) => {
            console.log('Save settings:', data);
            setShowSettingsModal(false);
            toast({
              title: "Settings updated",
              description: "Your settings have been saved successfully."
            });
          }}
        />
      </div>
    </div>
  );
};

export default WorkerProfileEdit;