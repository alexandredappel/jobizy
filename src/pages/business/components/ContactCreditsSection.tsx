import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ContactCreditsSection = () => {
  const credits = {
    used: 15,
    total: 20,
    percentage: 75,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">Contact Credits</h4>
          <p className="text-sm text-muted-foreground">
            {credits.used} of {credits.total} credits used
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Credits
        </Button>
      </div>
      
      <Progress value={credits.percentage} className="h-2" />
      
      {credits.percentage > 70 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Running low on credits! Consider upgrading your plan or purchasing additional credits.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactCreditsSection;