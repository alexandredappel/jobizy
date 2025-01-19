import { cn } from "@/lib/utils";

interface DashboardSectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

const DashboardSectionHeader = ({ title, action }: DashboardSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-secondary">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
};

export default DashboardSectionHeader;