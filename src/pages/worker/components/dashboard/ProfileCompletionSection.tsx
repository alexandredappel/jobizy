import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { Briefcase, GraduationCap } from "lucide-react";
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
  const { t } = useTranslation();

  const completionCards = [
    {
      title: t('worker.dashboard.profile.cards.experience.title'),
      description: profile.work_history?.length === 0
        ? t('worker.dashboard.profile.cards.experience.empty')
        : t('worker.dashboard.profile.cards.experience.update'),
      icon: Briefcase,
      onClick: onEditExperience,
      isComplete: profile.work_history?.length > 0,
    },
    {
      title: t('worker.dashboard.profile.cards.education.title'),
      description: profile.education?.length === 0
        ? t('worker.dashboard.profile.cards.education.empty')
        : t('worker.dashboard.profile.cards.education.update'),
      icon: GraduationCap,
      onClick: onEditEducation,
      isComplete: profile.education?.length > 0,
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