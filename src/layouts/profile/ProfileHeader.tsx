import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Building2 } from "lucide-react";

interface ProfileHeaderProps {
  image?: string;
  name: string;
  role?: string;
  businessType?: string;
  isAvailable?: boolean;
  badges?: { label: string; value: string; }[];
  onAvailabilityChange?: (value: boolean) => void;
}

const ProfileHeader = ({
  image,
  name,
  role,
  businessType,
  isAvailable,
  badges = [],
  onAvailabilityChange
}: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>
            {businessType ? (
              <Building2 className="w-12 h-12 text-muted-foreground" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-2xl font-semibold text-secondary">{name}</h1>
          {(role || businessType) && (
            <p className="text-muted-foreground">{role || businessType}</p>
          )}
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {badges.map((badge, index) => (
              <Badge key={index} variant="default">
                {badge.label}: {badge.value}
              </Badge>
            ))}
          </div>
        </div>

        {onAvailabilityChange && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAvailable}
              onCheckedChange={onAvailabilityChange}
              aria-label="Availability toggle"
            />
            <span className="text-sm text-muted-foreground">
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;