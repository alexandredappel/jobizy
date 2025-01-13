import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ProfileCompletionSection = () => {
  const completionPercentage = 65; // This would come from a real calculation

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Profile completion</span>
          <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <ActionCard
          title="Add experience"
          description="Add your work history"
          href="/worker/profile/edit"
        />
        <ActionCard
          title="Upload photo"
          description="Add a professional photo"
          href="/worker/profile/edit"
        />
        <ActionCard
          title="Add skills"
          description="List your key skills"
          href="/worker/profile/edit"
        />
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, href }: { title: string; description: string; href: string }) => (
  <div className="flex-shrink-0 w-48 p-4 border rounded-lg hover:border-primary transition-colors">
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-muted-foreground mb-2">{description}</p>
    <Button variant="link" className="p-0 h-auto" asChild>
      <a href={href} className="flex items-center text-primary">
        Complete <ArrowRight className="ml-1 h-4 w-4" />
      </a>
    </Button>
  </div>
);

export default ProfileCompletionSection;