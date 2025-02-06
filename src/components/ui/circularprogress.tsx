import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface CircularProgressProps extends 
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CircularProgressProps
>(({ className, value, size = 160, strokeWidth = 8, ...props }, ref) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - ((value || 0) / 100) * circumference;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      value={value}
      {...props}
    >
      <svg className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-secondary"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <ProgressPrimitive.Indicator asChild>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-primary transition-all duration-500 ease-out"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </ProgressPrimitive.Indicator>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold">{value}%</span>
      </div>
    </ProgressPrimitive.Root>
  );
});
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
