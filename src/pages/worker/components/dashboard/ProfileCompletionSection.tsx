import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { Briefcase, GraduationCap, Camera, MessageCircle } from "lucide-react";
import { WorkerUser, Education, WorkExperience } from "@/types/firebase.types";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileCompletionSectionProps {
  profile: WorkerUser;
  completionPercentage: number;
  onEditProfile: () => void;
  onEditExperience: () => void;
  onEditEducation: () => void;
  onEditAboutMe: () => void;
  experience: WorkExperience[];
  education: Education[];
}

const ProfileCompletionSection = ({
  profile,
  completionPercentage,
  onEditProfile,
  onEditExperience,
  onEditEducation,
  onEditAboutMe,
  experience,
  education,
}: ProfileCompletionSectionProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const completionCards = [
    {
      title: t('worker.dashboard.profile.cards.picture.title'),
      description: !profile.profile_picture_url
        ? t('worker.dashboard.profile.cards.picture.empty')
        : t('worker.dashboard.profile.cards.picture.update'),
      icon: Camera,
      onClick: onEditProfile,
      isComplete: !!profile.profile_picture_url,
    },
    {
      title: t('worker.dashboard.profile.cards.about.title'),
      description: !profile.about_me
        ? t('worker.dashboard.profile.cards.about.empty')
        : t('worker.dashboard.profile.cards.about.update'),
      icon: MessageCircle,
      onClick: onEditAboutMe,
      isComplete: !!profile.about_me,
    },
    {
      title: t('worker.dashboard.profile.cards.experience.title'),
      description: experience.length === 0
        ? t('worker.dashboard.profile.cards.experience.empty')
        : t('worker.dashboard.profile.cards.experience.update'),
      icon: Briefcase,
      onClick: onEditExperience,
      isComplete: experience.length > 0,
    },
    {
      title: t('worker.dashboard.profile.cards.education.title'),
      description: education.length === 0
        ? t('worker.dashboard.profile.cards.education.empty')
        : t('worker.dashboard.profile.cards.education.update'),
      icon: GraduationCap,
      onClick: onEditEducation,
      isComplete: education.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t('worker.dashboard.profile.completion.title')}</h2>
          <span className="text-lg font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">{t('worker.dashboard.profile.completion.subtitle')}</h3>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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