import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

const DashboardGrid = ({ children, columns = { sm: 1, md: 2, lg: 3 }, className }: DashboardGridProps) => {
  const gridCols = cn(
    "grid gap-4 md:gap-6",
    columns.sm && `grid-cols-1`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    className
  );

  return <div className={gridCols}>{children}</div>;
};

export default DashboardGrid;