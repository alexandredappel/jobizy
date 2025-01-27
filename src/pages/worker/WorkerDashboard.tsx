import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { useToast } from "@/hooks/use-toast";
import { createDashboardLayout } from "@/layouts/dashboard";
import WelcomeSection from "./components/dashboard/WelcomeSection";
import AvailabilitySection from "./components/dashboard/AvailabilitySection";
import ProfileCompletionSection from "./components/dashboard/ProfileCompletionSection";
import MainProfileEditModal from "./components/profile/modals/MainProfileEditModal";
import WorkExperienceModal from "./components/profile/modals/WorkExperienceModal";
import EducationModal from "./components/profile/modals/EducationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardGrid } from "@/layouts/dashboard";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useWorkerProfile(user?.id || '');
  const { toast } = useToast();
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);

  const handleToggleAvailability = async (value: boolean) => {
    try {
      await updateProfile({ availability_status: value });
      toast({
        title: value ? "You're now available" : "You're now unavailable",
        description: value 
          ? "Businesses can now find and contact you"
          : "You won't appear in search results",
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability status",
        variant: "destructive",
      });
    }
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const requirements = [
      !!profile.about_me,
      profile.work_history?.length > 0,
      profile.education?.length > 0,
      profile.languages?.length > 0,
      !!profile.job,
      profile.location?.length > 0,
      !!profile.profile_picture_url,
    ];

    const completed = requirements.filter(Boolean).length;
    return Math.round((completed / requirements.length) * 100);
  };

  if (isLoading || !profile) {
    return createDashboardLayout(
      <div className="space-y-8">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return createDashboardLayout(
    <div className="space-y-8">
      <WelcomeSection fullName={profile.full_name} />
      
      <DashboardGrid columns={{ sm: 1, md: 2, lg: 2 }} className="lg:grid-cols-[2fr,1fr]">
        <ProfileCompletionSection
          profile={profile}
          completionPercentage={calculateProfileCompletion()}
          onEditProfile={() => setShowProfileModal(true)}
          onEditExperience={() => setShowExperienceModal(true)}
          onEditEducation={() => setShowEducationModal(true)}
        />
        <AvailabilitySection
          isAvailable={profile.availability_status}
          onToggleAvailability={handleToggleAvailability}
        />
      </DashboardGrid>

      <MainProfileEditModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSave={updateProfile}
      />

      <WorkExperienceModal
        open={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        experiences={profile.work_history || []}
        userId={profile.id}
      />

      <EducationModal
        open={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        education={profile.education || []}
        userId={profile.id}
      />
    </div>
  );
};

export default WorkerDashboard;