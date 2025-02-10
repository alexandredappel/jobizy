
import React, { useState } from 'react';
import { Edit, Clock, Globe, MapPin, ChefHat, Coffee, CreditCard, User2, Home, Flower2, Droplets, Wine, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProfileContainer } from "@/layouts/profile";
import MainProfileEditModal from '../modals/MainProfileEditModal';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { WorkerUser } from '@/types/firebase.types';

const JOB_ICONS: Record<string, React.ElementType> = {
  'Waiter': Coffee,
  'Cook': ChefHat,
  'Cashier': CreditCard,
  'Manager': User2,
  'Housekeeper': Home,
  'Gardener': Flower2,
  'Pool technician': Droplets,
  'Bartender': Wine,
  'Seller': ShoppingBag,
};

interface MainProfileSectionProps {
  profile: WorkerUser | null;
  onSave: (values: Partial<WorkerUser>) => Promise<void>;
  onEdit?: () => void;
}

const MainProfileSection = ({ profile, onSave, onEdit }: MainProfileSectionProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setShowEditModal(true);
    }
  };

  if (!profile) return null;

  const handleAvailabilityChange = async (checked: boolean) => {
    await onSave({ availability_status: checked });
  };

  const handleContractTypeChange = async (type: "Full time" | "Part time") => {
    await onSave({ type_contract: type });
  };

  const renderBadges = (values: string[], type: 'contract' | 'languages' | 'location') => {
    if (!values?.length) return [t('worker.profile.sections.main.noneValue')];
    
    // Ne traduire que les langues
    if (type === 'languages') {
      if (values.length <= 2) return values.map(value => t(`languages.${value.toUpperCase()}`));
      return [
        ...values.slice(0, 2).map(value => t(`languages.${value.toUpperCase()}`)),
        t('worker.profile.sections.main.othersCount', { count: values.length - 2 })
      ];
    }
    
    // Pour les autres types (contract et location), afficher tel quel
    if (values.length <= 2) return values;
    return [
      ...values.slice(0, 2),
      t('worker.profile.sections.main.othersCount', { count: values.length - 2 })
    ];
  };

  const badgeSections = [
    {
      label: t('worker.profile.sections.main.workSchedule'),
      icon: Clock,
      values: [profile.type_contract],
      type: 'contract' as const
    },
    {
      label: t('worker.profile.sections.main.languages'),
      icon: Globe,
      values: profile.languages || [],
      type: 'languages' as const
    },
    {
      label: t('worker.profile.sections.main.location'),
      icon: MapPin,
      values: profile.location || [],
      type: 'location' as const
    }
  ];

  const AvailabilitySheetContent = () => {
    return (
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <button
            className={cn(
              "fixed bottom-[64px] left-0 right-0 z-50 w-full py-4 px-6 shadow-lg transition-colors",
              profile?.availability_status 
                ? "bg-primary text-primary-foreground"
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            <p className="text-center font-medium">
              {profile?.availability_status 
                ? t('worker.profile.sections.main.availability.mobileAvailable')
                : t('worker.profile.sections.main.availability.mobileUnavailable')
              }
            </p>
          </button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-[40vh]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <h3 className="text-lg font-semibold">{t('worker.profile.sections.main.availability.title')}</h3>
              
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={profile?.availability_status}
                    onCheckedChange={handleAvailabilityChange}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-red-500"
                  />
                  <span className={cn(
                    "font-semibold",
                    profile?.availability_status ? "text-primary" : "text-red-500"
                  )}>
                    {profile?.availability_status 
                      ? t('worker.profile.sections.main.availability.available')
                      : t('worker.profile.sections.main.availability.unavailable')
                    }
                  </span>
                </div>

                <div className="flex items-center gap-3 justify-center w-full px-4">
                  <Button
                    variant={profile?.type_contract === "Part time" ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      profile?.type_contract === "Part time"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-white text-primary hover:bg-white/90 border-primary"
                    )}
                    onClick={() => handleContractTypeChange("Part time")}
                  >
                    {t('worker.onboarding.steps.contract.types.partTime')}
                  </Button>
                  <Button
                    variant={profile?.type_contract === "Full time" ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      profile?.type_contract === "Full time"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-white text-primary hover:bg-white/90 border-primary"
                    )}
                    onClick={() => handleContractTypeChange("Full time")}
                  >
                    {t('worker.onboarding.steps.contract.types.fullTime')}
                  </Button>
                </div>

                <p className="text-muted-foreground text-center max-w-xs px-4">
                  {profile?.availability_status 
                    ? t('worker.profile.sections.main.availability.availableDescription')
                    : t('worker.profile.sections.main.availability.unavailableDescription')
                  }
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <ProfileContainer type="worker" mode="edit">
      <div className="space-y-6">
        <div className="relative bg-white rounded-[var(--radius)] pt-16">
          <div className="absolute right-4 top-4 flex items-center gap-4 hidden md:flex">
            <div className="flex items-center gap-2">
              <Switch
                checked={profile?.availability_status}
                onCheckedChange={handleAvailabilityChange}
                aria-label={t('worker.profile.sections.main.availability.toggleLabel')}
              />
              <span className="text-sm text-muted-foreground">
                {profile?.availability_status 
                  ? t('worker.profile.sections.main.availability.shortAvailable')
                  : t('worker.profile.sections.main.availability.shortUnavailable')
                }
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center">
            <div className="absolute -top-16">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.profile_picture_url} alt={profile.full_name} />
                <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <h2 className="text-2xl font-bold text-primary mt-6">{profile.full_name}</h2>
            
            <Badge className="mt-2 px-6 py-3 flex items-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 text-lg">
              {profile.job && JOB_ICONS[profile.job] && React.createElement(JOB_ICONS[profile.job], { className: "h-5 w-5" })}
              {profile.job && t(`jobs.${profile.job.toUpperCase().replace(' ', '_')}`)}
            </Badge>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-6">
              {badgeSections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <div key={sectionIndex} className="flex flex-col items-center bg-primary text-white p-4 rounded-lg">
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="mb-3">{section.label}</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {renderBadges(section.values, section.type).map((value, index) => (
                        <Badge 
                          key={index}
                          className="text-sm bg-white text-primary px-4 py-2 rounded-lg"
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <MainProfileEditModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={onSave}
      />
      
      <AvailabilitySheetContent />
    </ProfileContainer>
  );
};

export default MainProfileSection;

