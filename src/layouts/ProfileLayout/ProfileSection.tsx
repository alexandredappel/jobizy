import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}

const ProfileSection = ({ title, children, onEdit, className }: ProfileSectionProps) => {
  console.log('ProfileSection: Rendering section:', title);

  return (
    <Card className={cn("animate-in fade-in duration-500", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="text-xl font-semibold text-secondary">{title}</h2>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ProfileSection;