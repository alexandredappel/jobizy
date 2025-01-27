import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { UserCircle, Briefcase, GraduationCap, Languages } from "lucide-react";
import { WorkerUser } from "@/types/firebase.types";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileCompletionSectionProps {
  profile: WorkerUser;
  completionPercentage: number;
  onEditProfile: () => void;
  onEditExperience: () => void;
  onEditEducation: () => void;
}

const ProfileCompletionSection = ({
  profile,
  completionPercentage,
  onEditProfile,
  onEditExperience,
  onEditEducation,
}: ProfileCompletionSectionProps) => {
  const isMobile = useIsMobile();

  const completionCards = [
    {
      title: "Complete Your Profile",
      description: !profile.about_me 
        ? "Add a description about yourself to help businesses know you better"
        : "Update your profile information",
      icon: UserCircle,
      onClick: onEditProfile,
      isComplete: !!profile.about_me,
    },
    {
      title: "Add Work Experience",
      description: profile.work_history?.length === 0
        ? "Add your work experience to showcase your expertise"
        : "Update your work experience",
      icon: Briefcase,
      onClick: onEditExperience,
      isComplete: profile.work_history?.length > 0,
    },
    {
      title: "Add Education",
      description: profile.education?.length === 0
        ? "Add your education background to highlight your qualifications"
        : "Update your education details",
      icon: GraduationCap,
      onClick: onEditEducation,
      isComplete: profile.education?.length > 0,
    },
    {
      title: "Language Skills",
      description: profile.languages?.length === 0
        ? "Add the languages you speak to improve your chances"
        : "Update your language skills",
      icon: Languages,
      onClick: onEditProfile,
      isComplete: profile.languages?.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Profile Completion</h2>
          <span className="text-lg font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Complete Your Profile</h3>
        
        {isMobile ? (
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {completionCards.map((card, index) => (
                <CarouselItem key={index} className="pl-4 basis-[85%]">
                  <ProfileCompletionCard {...card} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completionCards.map((card, index) => (
              <ProfileCompletionCard key={index} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletionSection;