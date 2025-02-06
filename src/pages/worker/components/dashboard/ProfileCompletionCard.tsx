import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";

interface ProfileCompletionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  isComplete: boolean;
}

const ProfileCompletionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  isComplete 
}: ProfileCompletionCardProps) => {
  const { t } = useTranslation();

  const getFieldKey = (title: string) => {
    // Handle both English and Indonesian titles
    switch (title) {
      case 'Profile Picture':
      case 'Foto Profil':
        return 'picture';
      case 'About Me':
      case 'Tentang Saya':
        return 'about';
      case 'Add Work Experience':
      case 'Tambah Pengalaman Kerja':
        return 'experience';
      case 'Add Education':
      case 'Tambah Pendidikan':
        return 'education';
      default:
        console.warn('Unhandled title in getFieldKey:', title);
        return 'default';
    }
  };

  return (
    <Card className={cn(
      "p-6 h-full flex flex-col justify-between transition-colors duration-300",
      isComplete && "bg-primary text-primary-foreground"
    )}>
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
              field: t(`worker.dashboard.profile.cards.fields.${getFieldKey(title)}`)
            })}
          </p>
        ) : (
          <p className={cn(
            "text-muted-foreground",
            isComplete && "text-primary-foreground/80"
          )}>{description}</p>
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
