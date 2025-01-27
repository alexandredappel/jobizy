import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { UserCircle, Briefcase, GraduationCap, Languages, ChevronLeft, ChevronRight } from "lucide-react";
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
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Complete Your Profile</h3>
        {!isMobile && (
          <div className="flex items-center gap-1">
            <CarouselPrevious className="static translate-y-0 h-8" />
            <CarouselNext className="static translate-y-0 h-8" />
          </div>
        )}
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {completionCards.map((card, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <ProfileCompletionCard {...card} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {isMobile && (
          <>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default ProfileCompletionSection;