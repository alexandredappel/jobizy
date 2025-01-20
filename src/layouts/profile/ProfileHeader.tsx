import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from '@/types/database.types';

interface ProfileHeaderProps {
  type: UserRole;
  name: string;
  imageUrl?: string;
  isAvailable?: boolean;
  onAvailabilityToggle?: () => void;
  badges?: string[];
  className?: string;
}

const ProfileHeader = ({
  type,
  name,
  imageUrl,
  isAvailable,
  onAvailabilityToggle,
  badges = [],
  className
}: ProfileHeaderProps) => {
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-lg shadow-sm",
      "animate-in fade-in duration-500",
      className
    )}>
      <Avatar className="w-24 h-24">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>
          <User className="w-12 h-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left space-y-2">
        <h1 className="text-2xl font-semibold text-secondary">{name}</h1>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {badges.map((badge, index) => (
            <Badge key={index} variant="secondary">{badge}</Badge>
          ))}
        </div>
      </div>

      {type === 'worker' && onAvailabilityToggle && (
        <Toggle
          pressed={isAvailable}
          onPressedChange={onAvailabilityToggle}
          className="gap-2"
        >
          <UserCheck className={cn(
            "w-4 h-4",
            isAvailable ? "text-green-500" : "text-muted-foreground"
          )} />
          {isAvailable ? "Available" : "Unavailable"}
        </Toggle>
      )}
    </div>
  );
};

export default ProfileHeader;