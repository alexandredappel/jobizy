import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DashboardSectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

const DashboardSectionHeader = ({ title, action }: DashboardSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {action ? (
        <div className="flex items-center gap-2">
          {action}
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
      ) : null}
    </div>
  );
};

export default DashboardSectionHeader;