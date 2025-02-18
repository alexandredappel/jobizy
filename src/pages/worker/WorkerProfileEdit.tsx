import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { useWorkerExperience } from "@/hooks/useWorkerExperience";
import { useWorkerEducation } from "@/hooks/useWorkerEducation";
import { 
  MainProfileSection,
  WorkExperienceSection,
  EducationSection,
  AboutMeSection
} from './components/profile/sections';
import { ProfileContainer } from "@/layouts/profile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const WorkerProfileEdit = () => {
  const { user } = useAuth();
  const { profile, isLoading: isProfileLoading, updateProfile } = useWorkerProfile(user?.id || '');
  const { experience, isLoading: isExperienceLoading } = useWorkerExperience(user?.id || '');
  const { education, isLoading: isEducationLoading } = useWorkerEducation(user?.id || '');

  if (isProfileLoading || isExperienceLoading || isEducationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="space-y-8">
        <MainProfileSection 
          profile={profile} 
          onSave={updateProfile}
        />
        
        <WorkExperienceSection 
          experiences={experience}
          userId={user?.id || ''}
        />
        
        <EducationSection 
          education={education}
          userId={user?.id || ''}
        />
        
        <AboutMeSection 
          aboutMe={profile?.about_me}
          isLoading={isProfileLoading}
          onEdit={() => {/* Implement this */}}
        />
      </div>
    </ProfileContainer>
  );
};

export default WorkerProfileEdit;
