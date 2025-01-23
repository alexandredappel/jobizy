import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchLayoutProps {
  children: React.ReactNode;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}