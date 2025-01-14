import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Building2 } from "lucide-react";

interface ProfileHeaderProps {
  image: string;
  name: string;
  role?: string;
  businessType?: string;
  isAvailable?: boolean;
  badges: {
    label: string;
    value: string;
  }[];
  onAvailabilityChange?: (value: boolean) => void;
}

const ProfileHeader = ({
  image,
  name,
  role,
  businessType,
  isAvailable,
  badges,
  onAvailabilityChange
}: ProfileHeaderProps) => {
  console.log('ProfileHeader: Rendering for', name, 'with availability:', isAvailable);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>
            {role ? <User className="w-12 h-12" /> : <Building2 className="w-12 h-12" />}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-secondary">{name}</h1>
          {role && <p className="text-lg text-muted-foreground">{role}</p>}
          {businessType && <p className="text-lg text-muted-foreground">{businessType}</p>}
        </div>

        {typeof isAvailable !== 'undefined' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Available</span>
            <Switch
              checked={isAvailable}
              onCheckedChange={onAvailabilityChange}
              aria-label="Availability toggle"
            />
          </div>
        )}
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant="secondary">
              {badge.label}: {badge.value}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;