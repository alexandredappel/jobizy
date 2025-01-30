import React, { useState } from 'react';
import { Edit, Clock, Globe, MapPin, ChefHat, Coffee, CreditCard, User2, Home, Flower2, Droplets, Wine, ShoppingBag, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProfileContainer } from "@/layouts/profile";
import MainProfileEditModal from '../modals/MainProfileEditModal';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
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
  'Pool guy': Droplets,
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

  const renderBadges = (values: string[]) => {
    if (!values?.length) return ['None'];
    if (values.length <= 2) return values;
    return [...values.slice(0, 2), `+${values.length - 2} others`];
  };

  const badgeSections = [
    {
      label: 'Work Schedule',
      icon: Clock,
      values: profile?.type_contract ? [profile.type_contract, profile.experience] : [profile.experience]
    },
    {
      label: 'Languages',
      icon: Globe,
      values: profile.languages || []
    },
    {
      label: 'Location',
      icon: MapPin,
      values: profile.location || []
    }
  ];

  const AvailabilitySheetContent = () => {
    return (
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <button
            className={cn(
              "fixed bottom-[64px] left-0 right-0 z-50 w-full py-4 px-6 shadow-lg transition-colors",
              profile.availability_status 
                ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            <p className="text-center font-medium">
              {profile.availability_status 
                ? "You are currently available for work"
                : "You are currently not available for work"
              }
            </p>
          </button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-[30vh]"
          onInteractOutside={(e) => {
            if (e.target instanceof HTMLElement && e.target.closest('[role="switch"]')) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <h3 className="text-lg font-semibold">Availability Status</h3>
              <div className="flex items-center gap-3">
                <Switch
                  checked={profile.availability_status}
                  onCheckedChange={handleAvailabilityChange}
                  className={cn(
                    "h-8 w-14",
                    profile.availability_status 
                      ? "data-[state=checked]:bg-accent" 
                      : "data-[state=checked]:bg-red-500"
                  )}
                />
                <span className={cn(
                  "font-semibold",
                  profile.availability_status ? "text-accent" : "text-red-500"
                )}>
                  {profile.availability_status ? 'Available for work' : 'Not available'}
                </span>
              </div>
              <p className="text-muted-foreground text-center max-w-xs">
                {profile.availability_status 
                  ? "Employers can see your profile and contact you" 
                  : "Your profile is hidden from employers"}
              </p>
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
                checked={profile.availability_status}
                onCheckedChange={handleAvailabilityChange}
                aria-label="Availability toggle"
              />
              <span className="text-sm text-muted-foreground">
                {profile.availability_status ? "Available" : "Unavailable"}
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
              {profile.job}
            </Badge>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full p-6">
              {badgeSections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <div key={sectionIndex} className="flex flex-col items-center bg-primary text-white p-4 rounded-lg">
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="mb-3">{section.label}</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {renderBadges(section.values).map((value, index) => (
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