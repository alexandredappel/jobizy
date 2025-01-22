import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { WorkerUser } from "@/types/firebase.types";

interface AvailabilitySectionProps {
  isAvailable: boolean;
  onToggleAvailability: (value: boolean) => Promise<void>;
}

const AvailabilitySection = ({ isAvailable, onToggleAvailability }: AvailabilitySectionProps) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Availability Status</h2>
          <p className="text-muted-foreground">
            {isAvailable ? "You're currently available for work" : "You're currently unavailable for work"}
          </p>
        </div>
        <Switch
          checked={isAvailable}
          onCheckedChange={onToggleAvailability}
          className="scale-125"
        />
      </div>
    </Card>
  );
};

export default AvailabilitySection;