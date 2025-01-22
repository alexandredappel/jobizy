import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RemainingContactsProps {
  used: number;
  total: number;
}

const RemainingContactsSection = ({ used, total }: RemainingContactsProps) => {
  const percentage = (used / total) * 100;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Remaining Contacts</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{used} used</span>
          <span>{total - used} remaining</span>
        </div>
        <Progress value={percentage} />
      </div>
      <p className="text-sm text-muted-foreground">
        You can contact {total - used} more workers this month
      </p>
    </Card>
  );
};

export default RemainingContactsSection;