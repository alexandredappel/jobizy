import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

interface ProfileCompletionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  isComplete: boolean;
  fieldType: 'picture' | 'about' | 'experience' | 'education';
}

const ProfileCompletionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  isComplete,
  fieldType
}: ProfileCompletionCardProps) => {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <Card className={cn(
      "p-6 h-full flex flex-col justify-between transition-colors duration-300 relative overflow-hidden",
      isComplete && "bg-primary text-primary-foreground"
    )}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={100}
          gravity={0.3}
          colors={[
            '#439915', // primary
            '#5EC435', // secondary
            '#D2FF28', // accent
            '#FFFFFF', // white
          ]}
        />
      )}
      <div className="space-y-4">
        <div className={cn(
          "h-12 w-12 rounded-[24px] flex items-center justify-center",
          isComplete ? "bg-primary-foreground/10" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            isComplete ? "text-primary-foreground" : "text-primary"
          )} />
        </div>
        <h3 className={cn(
          "text-lg font-semibold",
          isComplete && "text-primary-foreground"
        )}>{title}</h3>
        
        {isComplete ? (
          <p className="text-primary-foreground/90">
            {t('worker.dashboard.profile.cards.completed', {
              field: t(`worker.dashboard.profile.cards.${fieldType}.title`).toLowerCase()
            })}
          </p>
        ) : (
          <div className="space-y-2">
            <p className={cn(
              "text-muted-foreground",
              isComplete && "text-primary-foreground/80"
            )}>{description}</p>
            <p className="text-primary text-foreground">
              {t(`worker.dashboard.profile.cards.${fieldType}.incentive`)}
            </p>
          </div>
        )}
      </div>
      <Button 
        onClick={onClick} 
        variant={isComplete ? "secondary" : "default"}
        className="mt-4"
      >
        {isComplete 
          ? t('worker.dashboard.profile.completion.update')
          : t('worker.dashboard.profile.completion.button')
        }
      </Button>
    </Card>
  );
};

export default ProfileCompletionCard;
