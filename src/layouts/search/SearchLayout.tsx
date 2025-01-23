import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchFilters } from "./components/SearchFilters";

interface SearchLayoutProps {
  children: React.ReactNode;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
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
              <SearchFilters />
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop: Sidebar Filters */}
        {!isMobile && (
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-4">
              <div className="border rounded-lg p-4 bg-card">
                <SearchFilters />
              </div>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}