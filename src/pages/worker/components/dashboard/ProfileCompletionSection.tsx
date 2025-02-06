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

  const nextStep = completionCards.find(card => !card.isComplete);

  return (
    <div className="space-y-8">
      {/* Section de progression */}
      <Card className="p-6">
        <div className={`flex ${isMobile ? 'flex-col space-y-6' : 'space-x-6'}`}>
          {/* Colonne de gauche - Cercle de progression */}
          <div className={`flex items-center justify-center ${isMobile ? 'w-full' : 'w-1/2'}`}>
            <CircularProgress value={completionPercentage} />
          </div>

          {/* Colonne de droite - Carte de la prochaine étape */}
          <div className={`flex flex-col justify-center ${isMobile ? 'w-full' : 'w-1/2'}`}>
            {completionPercentage === 100 ? (
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-green-600">
                  {t('worker.dashboard.profile.completion.complete')}
                </h3>
                <p className="text-muted-foreground">
                  {t('worker.dashboard.profile.completion.complete.description')}
                </p>
              </div>
            ) : nextStep ? (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {t('worker.dashboard.profile.completion.next')}
                </h3>
                <ProfileCompletionCard {...nextStep} />
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Section de toutes les cards */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          {t('worker.dashboard.profile.completion.all')}
        </h3>
        
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
