import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const JOBS = ["Waiter", "Cook", "Cashier", "Manager", "Housekeeper", "Gardener", "Pool guy", "Bartender", "Seller"] as const;
const WORK_AREAS = ["Seminyak", "Kuta", "Kerobokan", "Canggu", "Umalas", "Ubud", "Uluwatu", "Denpasar", "Sanur", "Jimbaran", "Pererenan", "Nusa Dua"] as const;
const LANGUAGES = ["English", "Bahasa"] as const;
const GENDERS = ["male", "female"] as const;

export function SearchLayout({ children }: SearchLayoutProps) {
  const isMobile = useIsMobile();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const FiltersContent = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <h3 className="font-medium mb-4">Filters</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select job" />
              </SelectTrigger>
              <SelectContent>
                {JOBS.map((job) => (
                  <SelectItem key={job} value={job}>{job}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Work Area</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {WORK_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Languages</label>
            <Command className="border rounded-md">
              <CommandInput placeholder="Search languages..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {LANGUAGES.map((language) => (
                  <CommandItem
                    key={language}
                    value={language}
                    onSelect={(value) => {
                      setSelectedLanguages((prev) => {
                        if (prev.includes(value)) {
                          return prev.filter((l) => l !== value);
                        }
                        return [...prev, value];
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        readOnly
                        className="h-4 w-4"
                      />
                      {language}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">Reset</Button>
            <Button className="flex-1">Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
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

        {!isMobile && (
          <div className="hidden md:block border rounded-lg p-4 bg-card">
            <FiltersContent />
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}