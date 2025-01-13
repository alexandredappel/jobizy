import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const AvailabilitySection = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Switch
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
          className="scale-125"
        />
        <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
          {isAvailable ? 'Available for work' : 'Not available'}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Toggle this switch to let businesses know if you're available for work
      </p>
    </div>
  );
};

export default AvailabilitySection;