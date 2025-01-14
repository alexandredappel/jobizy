import React from "react";
import { cn } from "@/lib/utils";

interface MessageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MessageContainer = ({ children, className }: MessageContainerProps) => {
  console.log("MessageContainer: Rendering");
  
  return (
    <div className={cn(
      "flex h-[100dvh] w-full flex-col bg-background",
      className
    )}>
      {children}
    </div>
  );
};

export default MessageContainer;