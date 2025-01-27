import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ProfileCompletionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

const ProfileCompletionCard = ({ title, description, icon: Icon, onClick }: ProfileCompletionCardProps) => {
  return (
    <Card className="p-6 h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="h-12 w-12 rounded-[24px] bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onClick} className="mt-4">
        Complete Now
      </Button>
    </Card>
  );
};

export default ProfileCompletionCard;