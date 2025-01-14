import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchLayoutProps {
  children: React.ReactNode;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  const isMobile = useIsMobile();

  const FiltersContent = () => (
    <div className="space-y-4 py-4">
      <h3 className="font-medium">Filters</h3>
      {/* Filter components will be added later */}
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        {/* Mobile: Filters in Sheet */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <FiltersContent />
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop: Horizontal Filters */}
        {!isMobile && (
          <div className="hidden md:block border rounded-lg p-4 bg-card">
            <FiltersContent />
          </div>
        )}

        {/* Results Area */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}