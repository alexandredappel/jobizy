import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { UserCircle, Briefcase, GraduationCap, Languages } from "lucide-react";
import { WorkerUser } from "@/types/firebase.types";

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
        <div className="text-lg font-medium">
          {completionPercentage}% Complete
        </div>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {completionCards.map((card, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <ProfileCompletionCard {...card} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProfileCompletionSection;