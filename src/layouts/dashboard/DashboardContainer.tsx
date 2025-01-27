import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardContainer = ({ children, className }: DashboardContainerProps) => {
  return (
    <div className={cn(
      "container mx-auto p-4 md:p-6 lg:py-8 lg:pr-8 lg:pl-0",
      "bg-background/50 min-h-screen",
      className
    )}>
      {children}
    </div>
  );
};

export default DashboardContainer;