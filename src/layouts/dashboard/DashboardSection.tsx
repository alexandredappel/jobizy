import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardSectionHeader from "./DashboardSectionHeader";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const DashboardSection = ({ title, children, className, action }: DashboardSectionProps) => {
  return (
    <Card className={cn("animate-in fade-in duration-500", className)}>
      <CardHeader className="p-6">
        <DashboardSectionHeader title={title} action={action} />
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardSection;