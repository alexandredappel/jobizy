import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardContainer = ({ children, className }: DashboardContainerProps) => {
  return (
    <div className={cn("container mx-auto p-4 md:p-6 lg:py-8 lg:px-40", className)}>
      {children}
    </div>
  );
};

export default DashboardContainer;