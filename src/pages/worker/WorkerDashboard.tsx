import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { useToast } from "@/hooks/use-toast";
import { createDashboardLayout } from "@/layouts/dashboard";
import { useTranslation } from 'react-i18next';
import WelcomeSection from "./components/dashboard/WelcomeSection";
import AvailabilitySection from "./components/dashboard/AvailabilitySection";
import ProfileCompletionSection from "./components/dashboard/ProfileCompletionSection";
import MainProfileEditModal from "./components/profile/modals/MainProfileEditModal";
import WorkExperienceModal from "./components/profile/modals/WorkExperienceModal";
import EducationModal from "./components/profile/modals/EducationModal";
import AboutMeModal from "./components/profile/modals/AboutMeModal";
import { Skeleton } from "@/components/ui/skeleton";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useWorkerProfile(user?.id || '');
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showAboutMeModal, setShowAboutMeModal] = useState(false);

  const handleToggleAvailability = async (value: boolean) => {
    try {
      await updateProfile({ availability_status: value });
      toast({
        title: value ? t('worker.dashboard.availability.toast.available.title') : t('worker.dashboard.availability.toast.unavailable.title'),
        description: value 
          ? t('worker.dashboard.availability.toast.available.description')
          : t('worker.dashboard.availability.toast.unavailable.description'),
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: t('worker.dashboard.availability.toast.error.title'),
        description: t('worker.dashboard.availability.toast.error.description'),
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
    <>
      <WelcomeSection 
        fullName={profile.full_name} 
        profilePicture={profile.profile_picture_url}
      />
      
      <AvailabilitySection
        isAvailable={profile.availability_status}
        onToggleAvailability={handleToggleAvailability}
      />
      
      <ProfileCompletionSection
        profile={profile}
        completionPercentage={calculateProfileCompletion()}
        onEditProfile={() => setShowProfileModal(true)}
        onEditExperience={() => setShowExperienceModal(true)}
        onEditEducation={() => setShowEducationModal(true)}
        onEditAboutMe={() => setShowAboutMeModal(true)}
      />

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

      <AboutMeModal
        open={showAboutMeModal}
        onClose={() => setShowAboutMeModal(false)}
        aboutMe={profile.about_me || ''}
        userId={profile.id}
      />
    </>
  );
};

export default WorkerDashboard;