import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const DashboardGrid = ({ children, columns = { sm: 1, md: 2, lg: 3 } }: DashboardGridProps) => {
  const gridCols = cn(
    "grid gap-6",
    columns.sm && `grid-cols-1`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`
  );

  return <div className={gridCols}>{children}</div>;
};

export default DashboardGrid;