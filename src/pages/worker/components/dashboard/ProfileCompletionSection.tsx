import { useTranslation } from 'react-i18next';
import { WorkerUser, Education, WorkExperience } from "@/types/firebase.types";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProfileCompletionCard from "./ProfileCompletionCard";
import { Briefcase, GraduationCap, Camera, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CircularProgress } from "@/components/ui/circularprogress";

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
      incentive: t('worker.dashboard.profile.cards.picture.incentive'),
      fieldType: 'picture' as const,
    },
    {
      title: t('worker.dashboard.profile.cards.about.title'),
      description: !profile.about_me
        ? t('worker.dashboard.profile.cards.about.empty')
        : t('worker.dashboard.profile.cards.about.update'),
      icon: MessageCircle,
      onClick: onEditAboutMe,
      isComplete: !!profile.about_me,
      incentive: t('worker.dashboard.profile.cards.about.incentive'),
      fieldType: 'about' as const,
    },
    {
      title: t('worker.dashboard.profile.cards.experience.title'),
      description: experience.length === 0
        ? t('worker.dashboard.profile.cards.experience.empty')
        : t('worker.dashboard.profile.cards.experience.update'),
      icon: Briefcase,
      onClick: onEditExperience,
      isComplete: experience.length > 0,
      incentive: t('worker.dashboard.profile.cards.experience.incentive'),
      fieldType: 'experience' as const,
    },
    {
      title: t('worker.dashboard.profile.cards.education.title'),
      description: education.length === 0
        ? t('worker.dashboard.profile.cards.education.empty')
        : t('worker.dashboard.profile.cards.education.update'),
      icon: GraduationCap,
      onClick: onEditEducation,
      isComplete: education.length > 0,
      incentive: t('worker.dashboard.profile.cards.education.incentive'),
      fieldType: 'education' as const,
    },
  ];

  const nextStep = completionCards.find(card => !card.isComplete);
  const remainingPercentage = 100 - completionPercentage;

  return (
    <Card className="p-6 space-y-8">
      {/* Section de progression */}
      <div className={`flex ${isMobile ? 'flex-col space-y-6' : 'space-x-6'}`}>
        {/* Colonne de gauche - Cercle de progression */}
        <div className={`flex items-center justify-center ${isMobile ? 'w-full' : 'w-1/2'}`}>
          <div className={`transition-all duration-500 ${completionPercentage === 100 ? 'scale-110' : ''}`}>
            <CircularProgress 
              value={completionPercentage} 
              strokeWidth={12}
              className="[&_circle:first-child]:stroke-accent [&_circle:last-child]:stroke-primary [&_span]:text-primary"
            />
            {remainingPercentage > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {t('worker.dashboard.profile.completion.remaining', { percentage: remainingPercentage })}
              </p>
            )}
          </div>
        </div>

        {/* Colonne de droite - Carte de la prochaine étape */}
        <div className={`flex flex-col justify-center ${isMobile ? 'w-full' : 'w-1/2'}`}>
          {completionPercentage === 100 ? (
            <div className="text-center space-y-2 animate-fade-in">
              <h3 className="text-xl font-semibold text-green-600">
                {t('worker.dashboard.profile.completion.complete')}
              </h3>
              <p className="text-muted-foreground">
                {t('worker.dashboard.profile.completion.complete.description')}
              </p>
            </div>
          ) : nextStep ? (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium mb-4">
                {t('worker.dashboard.profile.completion.next')}
              </h3>
            </div>
          ) : null}
        </div>
      </div>

      {/* Section de toutes les cards */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          {t('worker.dashboard.profile.completion.all')}
        </h3>
        
        {isMobile ? (
          <Carousel opts={{ align: "start", dragFree: true }}>
            <CarouselContent className="-ml-4">
              {completionCards.map((card, index) => (
                <CarouselItem key={index} className="pl-4 basis-[85%]">
                  <div className={`transition-all duration-500 ${card.isComplete ? 'animate-fade-in' : ''}`}>
                    <ProfileCompletionCard {...card} />
                    {!card.isComplete && card.incentive && (
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {completionCards.map((card, index) => (
              <div 
                key={index}
                className={`transition-all duration-500 ${card.isComplete ? 'animate-fade-in' : ''}`}
              >
                <ProfileCompletionCard {...card} />
                {!card.isComplete && card.incentive && (
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCompletionSection;
