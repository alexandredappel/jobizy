import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const UpgradeSection = () => {
  const benefits = [
    "Unlimited contact credits",
    "Priority support",
    "Advanced analytics",
    "Custom branding",
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Upgrade to Premium</h4>
        <p className="text-sm text-muted-foreground">
          Get unlimited access to all features and priority support
        </p>
      </div>
      
      <ul className="space-y-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center">
            <Check className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{benefit}</span>
          </li>
        ))}
      </ul>
      
      <div className="pt-4">
        <Button className="w-full">
          Upgrade Now
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Starting from $49/month
        </p>
      </div>
    </div>
  );
};

export default UpgradeSection;