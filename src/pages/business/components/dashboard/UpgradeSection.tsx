import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const UpgradeSection = () => {
  const benefits = [
    "Unlimited worker contacts",
    "Priority support",
    "Advanced search filters",
    "Saved searches",
    "Urgent staff replacement priority"
  ];

  return (
    <Card className="p-6 bg-primary/5 border-primary/20">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upgrade to Premium</h2>
        <p className="text-muted-foreground">
          Get unlimited access to all features and find the perfect staff for your business
        </p>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full">
          Upgrade Now
        </Button>
      </div>
    </Card>
  );
};

export default UpgradeSection;